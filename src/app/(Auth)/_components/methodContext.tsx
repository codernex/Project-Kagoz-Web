"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type ResetMethod = "email" | "phone";

interface ResetContextType {
  method: ResetMethod;
  setMethod: (method: ResetMethod) => void;
}

const ResetContext = createContext<ResetContextType | undefined>(undefined);

export const ResetProvider = ({ children }: { children: ReactNode }) => {
  const [method, setMethod] = useState<ResetMethod>("email");

  return (
    <ResetContext.Provider value={{ method, setMethod }}>
      {children}
    </ResetContext.Provider>
  );
};

export const useReset = () => {
  const context = useContext(ResetContext);
  if (!context) throw new Error("useReset must be used within ResetProvider");
  return context;
};
