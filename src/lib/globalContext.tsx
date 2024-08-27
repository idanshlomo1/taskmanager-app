"use client"

import { createContext, ReactNode } from "react";


interface GlobalContextType {

}

interface GlobalContextUpdateType {

}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);
const GlobalContextUpdate = createContext<GlobalContextUpdateType | undefined>(undefined);


export const GlobalContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {


    return (
        <GlobalContext.Provider value={{}}>
            <GlobalContextUpdate.Provider value={{}}>
                {children}
            </GlobalContextUpdate.Provider>
        </GlobalContext.Provider>
    );
};