'use client'

import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material'

interface RecipeFormProps {
  onRecipeAdded: () => void
}

export default function RecipeForm({ onRecipeAdded }: RecipeFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    instructions: '',
    ingredients: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({
          title: '',
          author: '',
          instructions: '',
          ingredients: '',
        })
        onRecipeAdded()
      }
    } catch (error) {
      console.error('Error creating recipe:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add New Recipe
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              fullWidth
              label="Recipe Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </Box>
          <TextField
            fullWidth
            label="Ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />
          <TextField
            fullWidth
            label="Instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            multiline
            rows={6}
            required
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ alignSelf: 'flex-start' }}
          >
            {loading ? 'Adding Recipe...' : 'Add Recipe'}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}