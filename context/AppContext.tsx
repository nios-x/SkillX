// src/context/AppContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

const AppContext = createContext<any>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(true);
  const [userPoints, setUserPoints] = useState(1000);
  const [userdata, setUserData]  = useState(null);   
  const toggleTheme = () => setIsDark((prev) => !prev);
  useEffect(() => { 
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/getUserInfo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }); 
        if (response.ok) {
          const data = await response.json(); 
          console.log(data)
          setUserData(data.user); 
          setUserPoints(data.user.points); 
        } else {  
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } 
    };
    fetchUserData();
  }, []);
  
  return (
    <AppContext.Provider value={{ isDark, toggleTheme, userPoints, setUserPoints, userdata, setUserData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): any => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used inside AppProvider");
  return context;
};
