import { createContext, useContext, useState, type PropsWithChildren } from "react";

type ContextApiState = {
  activeSection: string;
  setActiveSection: (value: string) => void;
};

const ContextApiContext = createContext<ContextApiState | undefined>(undefined);

export function ContextApiProvider({ children }: PropsWithChildren) {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <ContextApiContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </ContextApiContext.Provider>
  );
}

export function useContextApi() {
  const context = useContext(ContextApiContext);

  if (!context) {
    throw new Error("useContextApi must be used inside ContextApiProvider.");
  }

  return context;
}
