"use client"

import axios from "axios"
import { createContext, ReactNode, useEffect, useState } from "react"
import { Task } from "./types"
import Loader from "@/components/Loader"
import toast from "react-hot-toast"

interface GlobalContextType {
    tasks: Task[]
    isLoading: boolean
    isInitialLoading: boolean
}

interface GlobalContextUpdateType {
    fetchTasks: () => Promise<void>
    createTask: (newTask: Task) => Promise<void>
    deleteTask: (id: string) => Promise<void>
    updateTask: (updatedTask: Task) => Promise<void>
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)
const GlobalContextUpdate = createContext<GlobalContextUpdateType | undefined>(undefined)

export const GlobalContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [tasks, setTasks] = useState<Task[]>([])
    const [isReady, setIsReady] = useState(false)

    const fetchTasks = async () => {
        setIsLoading(true)
        try {
            const res = await axios.get("/api/tasks")
            const sorted = res.data.sort((a: Task, b: Task) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            })
            setTasks(sorted)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
            setIsInitialLoading(false)
        }
    }

    const deleteTask = async (id: string) => {
        // Remove task from state immediately for smooth animation
        setTasks(tasks.filter(task => task.id !== id))
        
        try {
            await axios.delete(`/api/tasks/${id}`)
            toast.success("Task deleted successfully.")
        } catch (error) {
            // If API call fails, add the task back
            const taskToRestore = tasks.find(task => task.id === id)
            if (taskToRestore) {
                setTasks(prevTasks => [...prevTasks, taskToRestore])
            }
            toast.error("Failed to delete task.")
            console.log(error)
        }
    }

    const createTask = async (newTask: Task) => {
        const tempId = Date.now().toString()
        const optimisticTask = { ...newTask, id: tempId }
        setTasks([optimisticTask, ...tasks])
        
        try {
            const res = await axios.post("/api/tasks", newTask)
            if (res.data.error) {
                toast.error(res.data.error)
                return
            }
            setTasks(prevTasks =>
                prevTasks.map(task => (task.id === tempId ? res.data : task))
            )
            toast.success("Task created successfully.")
        } catch (error) {
            setTasks(tasks.filter(task => task.id !== tempId))
            toast.error("Failed to create task.")
            console.log(error)
        }
    }

    const updateTask = async (updatedTask: Task) => {
        const previousTasks = [...tasks]
        setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)))

        try {
            const res = await axios.put(`/api/tasks/${updatedTask.id}`, updatedTask)
            if (res.data.error) {
                throw new Error(res.data.error)
            }
        } catch (error) {
            setTasks(previousTasks)
            toast.error("Failed to update task.")
            console.log(error)
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setIsReady(true)
        }, 500)
    }, [])

    if (!isReady) {
        return <Loader />
    }

    return (
        <GlobalContext.Provider value={{ tasks, isLoading, isInitialLoading }}>
            <GlobalContextUpdate.Provider value={{ fetchTasks, createTask, deleteTask, updateTask }}>
                {children}
            </GlobalContextUpdate.Provider>
        </GlobalContext.Provider>
    )
}

export { GlobalContext, GlobalContextUpdate }