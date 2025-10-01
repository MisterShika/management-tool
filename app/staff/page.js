// app/page.js
"use client";

import { useEffect, useState } from 'react';
import LoginForm from '@/components/LoginForm';
import Loading from '@/components/Loading';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/getUser');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : user ? (
        <div>
          Staff Info
        </div>
      ) : (
        
        <LoginForm />
      )}
    </div>
  );
}
