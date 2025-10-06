// components/AuthWrapper.jsx
"use client";

import { useEffect, useState } from "react";
import Loading from "./Loading";
import LoginForm from "./LoginForm";

export default function AuthWrapper({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/getUser");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) return <Loading />;
  if (!user) return <LoginForm />;

  return (
    <div>
      {children}
    </div>
  );
}
