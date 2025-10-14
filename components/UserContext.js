"use client";

import { createContext, useContext } from "react";

// Create the context
const UserContext = createContext(null);

// Custom hook to use it easily
export function useUser() {
  return useContext(UserContext);
}

// Provider component
export function UserProvider({ user, children }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
