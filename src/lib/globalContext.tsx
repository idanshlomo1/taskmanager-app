"use client";

import axios from "axios";
import { createContext, ReactNode, useEffect, useState } from "react";
import { Task } from "./types";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

// Define the types for the context values
interface GlobalContextType {
    tasks: Task[];
    isLoading: boolean;
    isInitialLoading: boolean;
}

interface GlobalContextUpdateType {
    fetchTasks: () => Promise<void>;
    createTask: (newTask: Task) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    updateTask: (updatedTask: Task) => Promise<void>; // New updateTask function
}

// Create contexts
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);
const GlobalContextUpdate = createContext<GlobalContextUpdateType | undefined>(undefined);

export const GlobalContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isReady, setIsReady] = useState(false);

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("/api/tasks");
            const sorted = res.data.sort((a: Task, b: Task) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            setTasks(sorted);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            setIsInitialLoading(false);
        }
    };

    const deleteTask = async (id: string) => {
        setIsLoading(true);
        try {
            await axios.delete(`/api/tasks/${id}`);
            toast.success("Task deleted successfully.");
            fetchTasks();
        } catch (error) {
            toast.error("Something went wrong.");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const createTask = async (newTask: Task) => {
        setIsLoading(true);
        try {
            const res = await axios.post("/api/tasks", newTask);
            if (res.data.error) {
                toast.error(res.data.error);
                return;
            }
            toast.success("Task created successfully.");
            fetchTasks();
        } catch (error) {
            toast.error("Something went wrong.");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateTask = async (updatedTask: Task) => {
        setIsLoading(true);
        try {
            const res = await axios.put(`/api/tasks/${updatedTask.id}`, updatedTask);
            if (res.data.error) {
                toast.error(res.data.error);
                return;
            }
            // toast.success("Task updated successfully.");
            fetchTasks();
        } catch (error) {
            toast.error("Something went wrong.");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setIsReady(true);
        }, 500);
    }, []);

    if (!isReady) {
        return <Loader />;
    }

    return (
        <GlobalContext.Provider value={{ tasks, isLoading, isInitialLoading }}>
            <GlobalContextUpdate.Provider value={{ fetchTasks, createTask, deleteTask, updateTask }}>
                {children}
            </GlobalContextUpdate.Provider>
        </GlobalContext.Provider>
    );
};

// Export the contexts for use in other components
export { GlobalContext, GlobalContextUpdate };
