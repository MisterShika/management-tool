"use client"

import { useState } from 'react'

export default function LoginForm() {
  const [pin, setPin] = useState('')
  const [userCode, setUserCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("") // reset previous errors

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userCode, pin }),
      })

      if (res.ok) {
        window.location.reload() // successful login
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.message || "Login failed")
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }


  return (
    <form className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold mb-6">こんにちは！</h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="idnumber">
          ID番号
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="idnumber"
          type="text"
          onChange={(e) => setUserCode(e.target.value.replace(/\D/g, ''))}
          value={userCode}
          maxLength={4}
          placeholder="ID番号を入力"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          暗証番号
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          maxLength={4}
            onChange={(e) =>
                setPin(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))
            }
          value={pin}
          placeholder="暗証番号を入力"
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center`}
          type="submit"
          disabled={loading} // disable button while loading
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3h-4z"
              ></path>
            </svg>
          ) : null}
          {loading ? 'Logging in...' : 'ログイン'}
        </button>
      </div>
    </form>
  )
}
