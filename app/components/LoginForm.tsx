'use client'

import { useState } from 'react'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
} from '@mui/material'
import { Lock, Restaurant } from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'

export default function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const success = await login(password)
      if (!success) {
        setError('Incorrect password. Please try again.')
        setPassword('')
      }
    } catch {
      setError('An error occurred. Please try again.')
      setPassword('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            textAlign: 'center',
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Restaurant sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              FoodDB
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please enter the password to access the recipe database
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              placeholder="Enter password"
            />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isSubmitting || !password.trim()}
              sx={{ mt: 1 }}
            >
              {isSubmitting ? 'Checking...' : 'Enter'}
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
            Contact your administrator if you need access
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
}