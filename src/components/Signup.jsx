import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '../context/store'
import Logo from './Logo'

const Signup = () => {
  const navigate = useNavigate()
  const login = useStore((state) => state.login)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Frontend-only validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Veuillez remplir tous les champs')
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      setIsLoading(false)
      return
    }

    // Simulate account creation (frontend only - no backend)
    setTimeout(() => {
      // For demo purposes, create account and auto-login
      login({
        email: formData.email,
        name: formData.name,
      })
      setIsLoading(false)
      navigate('/')
    }, 500)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-neon-green/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-strong border-2 border-neon-green/30 rounded-2xl p-8 shadow-neon-green-lg animate-scaleIn">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
              <Logo width={64} height={64} />
            </div>
            <h1 className="text-3xl font-bold text-neon-green uppercase tracking-wider mb-2" style={{ textShadow: '0 0 10px rgba(0,255,0,0.5)' }}>
              Patrol-X
            </h1>
            <p className="text-neon-green/70 text-sm font-mono uppercase">Créer un compte</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm animate-fadeIn">
              {error}
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neon-green/80 mb-2 font-mono uppercase">
                Nom
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/50 border border-neon-green/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-green focus:shadow-neon-green transition-all duration-300"
                placeholder="Votre nom"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neon-green/80 mb-2 font-mono uppercase">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/50 border border-neon-green/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-green focus:shadow-neon-green transition-all duration-300"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neon-green/80 mb-2 font-mono uppercase">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/50 border border-neon-green/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-green focus:shadow-neon-green transition-all duration-300"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neon-green/80 mb-2 font-mono uppercase">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/50 border border-neon-green/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-green focus:shadow-neon-green transition-all duration-300"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-neon-green/20 border-2 border-neon-green text-neon-green font-bold uppercase tracking-wider rounded-lg hover:bg-neon-green/30 hover:shadow-neon-green-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-neon-green/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
                  Création...
                </span>
              ) : (
                'Créer un compte'
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-neon-green/60 text-sm">
              Déjà un compte ?{' '}
              <Link
                to="/login"
                className="text-neon-green hover:text-neon-green-light font-semibold underline underline-offset-2 transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup

