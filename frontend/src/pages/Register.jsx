import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import backround_img from "../assets/images/backrounf.webp"

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Registration failed')
      }

      const data = await response.json()

      // auto login after registration
      login({ username: data.username, token: data.token })

      navigate('/profile')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* LEFT SIDE UI */}
        <div className="p-8">
          <h1 className="text-6xl font-extrabold mb-2">Create Account</h1>
          <p className="text-gray-500 mb-10">Join us and start your journey</p>

          {error && (
            <p className="text-red-500 mb-4 text-lg font-semibold">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full p-4 rounded-xl border border-gray-300 bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full p-4 rounded-xl border border-gray-300 bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="w-full p-4 rounded-xl border border-gray-300 bg-gray-100 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl text-lg font-semibold disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'REGISTER'}
            </button>
          </form>

          <p className="mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600">Login</a>
          </p>
        </div>

        {/* RIGHT ILLUSTRATION */}
        <div className="flex justify-center items-center">
          <img
            src={backround_img}
            alt="illustration"
            className="rounded-3xl w-full shadow-xl"
          />
        </div>
      </div>
    </div>
  )
}