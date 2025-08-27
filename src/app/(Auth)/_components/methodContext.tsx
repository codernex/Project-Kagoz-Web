"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type ResetMethod = "email" | "phone";

interface ResetContextType {
  method: ResetMethod;
  setMethod: (method: ResetMethod) => void;
  email: string;
  setEmail: (email: string) => void;
}

const ResetContext = createContext<ResetContextType | undefined>(undefined);

export const ResetProvider = ({ children }: { children: ReactNode }) => {
  const [method, setMethod] = useState<ResetMethod>("email");
  const [email, setEmail] = useState<string>("");

  return (
    <ResetContext.Provider value={{ method, setMethod, email, setEmail }}>
      {children}
    </ResetContext.Provider>
  );
};

export const useReset = () => {
  const context = useContext(ResetContext);
  if (!context) throw new Error("useReset must be used within ResetProvider");
  return context;
};
