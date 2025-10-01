// app/page.js
"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import LoginForm from '../components/LoginForm';
import LogoutButton from '../components/LogoutButton';

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
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Image
        src="/images/logoTemp.png"
        alt="Logo"
        width={250}
        height={100}
        className="mb-6"
      />
      <h1 className="text-3xl font-bold mb-6">こんにちは！</h1>

      {/* Only this part waits on loading */}
      {loading ? (
        <p className="text-xl">Loading...</p>
      ) : user ? (
        <div>
          <p>Logged in as user {user.id} with access {user.access}</p>
          <LogoutButton onLogout={() => setUser(null)} />
        </div>
      ) : (
        <LoginForm />
      )}
    </main>
  );
}
