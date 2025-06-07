'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import IngredientInput, { StructuredIngredient } from '../components/IngredientInput'

export default function AddRecipePage() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    instructions: '',
    servings: 4,
    prepTime: '',
    cookTime: '',
  })
  const [structuredIngredients, setStructuredIngredients] = useState<StructuredIngredient[]>([])
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

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
      const payload = {
        ...formData,
        prepTime: formData.prepTime ? parseInt(formData.prepTime) : null,
        cookTime: formData.cookTime ? parseInt(formData.cookTime) : null,
        structuredIngredients: structuredIngredients,
        // Create legacy ingredients string for backward compatibility
        ingredients: structuredIngredients
          .map(ing => `${ing.amount} ${ing.unit} ${ing.name}${ing.optional ? ' (optional)' : ''}`)
          .join('\n'),
      }

      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setFormData({
          title: '',
          author: '',
          instructions: '',
          servings: 4,
          prepTime: '',
          cookTime: '',
        })
        setStructuredIngredients([])
        setShowSuccess(true)
        // Redirect to recipes page after 2 seconds
        setTimeout(() => {
          router.push('/recipes')
        }, 2000)
      }
    } catch (error) {
      console.error('Error creating recipe:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Recipe
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Share your favorite recipe with the community
      </Typography>

      <Paper elevation={2} sx={{ p: 4, maxWidth: 1000 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Basic Info Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Recipe Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Chocolate Chip Cookies"
                />
                <TextField
                  fullWidth
                  label="Author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  placeholder="e.g., John Doe"
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  label="Servings"
                  name="servings"
                  type="number"
                  value={formData.servings}
                  onChange={handleChange}
                  inputProps={{ min: 1, max: 50 }}
                  sx={{ width: 150 }}
                />
                <TextField
                  label="Prep Time (minutes)"
                  name="prepTime"
                  type="number"
                  value={formData.prepTime}
                  onChange={handleChange}
                  placeholder="e.g., 15"
                  sx={{ width: 200 }}
                />
                <TextField
                  label="Cook Time (minutes)"
                  name="cookTime"
                  type="number"
                  value={formData.cookTime}
                  onChange={handleChange}
                  placeholder="e.g., 30"
                  sx={{ width: 200 }}
                />
              </Box>
            </Box>

            <Divider />
            
            {/* Ingredients Section */}
            <IngredientInput
              ingredients={structuredIngredients}
              onChange={setStructuredIngredients}
            />

            <Divider />
            
            {/* Instructions Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Instructions
              </Typography>
              <TextField
                fullWidth
                label="Cooking Instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                multiline
                rows={8}
                required
                placeholder="Step-by-step cooking instructions..."
                helperText="Be as detailed as possible for best results"
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || structuredIngredients.length === 0}
                startIcon={<Add />}
                sx={{ minWidth: 140 }}
              >
                {loading ? 'Adding...' : 'Add Recipe'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          Recipe added successfully! Redirecting to recipes page...
        </Alert>
      </Snackbar>
    </Box>
  )
}