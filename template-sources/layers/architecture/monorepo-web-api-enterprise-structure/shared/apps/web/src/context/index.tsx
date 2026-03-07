import { createContext, useContext, useState, type PropsWithChildren } from "react";

type ContextState = {
  activeSection: string;
  setActiveSection: (value: string) => void;
};

const ContextContext = createContext<ContextState | undefined>(undefined);

export function ContextProvider({ children }: PropsWithChildren) {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <ContextContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </ContextContext.Provider>
  );
}

export function useContext() {
  const context = useContext(ContextContext);

  if (!context) {
    throw new Error("useContext must be used inside ContextProvider.");
  }

  return context;
}
