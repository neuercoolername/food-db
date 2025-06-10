'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Snackbar,
  IconButton,
} from '@mui/material'
import { Save, ArrowBack } from '@mui/icons-material'
import IngredientInput, { StructuredIngredient } from '../../../components/IngredientInput'

interface Recipe {
  id: string
  title: string
  author: string
  instructions: string
  ingredients: string
  servings?: number
  prepTime?: number
  cookTime?: number
  structuredIngredients?: StructuredIngredient[]
}

export default function EditRecipePage() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    instructions: '',
    ingredients: '',
    servings: 4,
    prepTime: undefined as number | undefined,
    cookTime: undefined as number | undefined,
  })
  const [structuredIngredients, setStructuredIngredients] = useState<StructuredIngredient[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const params = useParams()
  const router = useRouter()

  const fetchRecipe = useCallback(async () => {
    try {
      setFetchLoading(true)
      const response = await fetch(`/api/recipes/${params.id}`)
      if (response.ok) {
        const recipe: Recipe = await response.json()
        setFormData({
          title: recipe.title,
          author: recipe.author,
          instructions: recipe.instructions,
          ingredients: recipe.ingredients,
          servings: recipe.servings || 4,
          prepTime: recipe.prepTime,
          cookTime: recipe.cookTime,
        })
        setStructuredIngredients(recipe.structuredIngredients || [])
      } else if (response.status === 404) {
        router.push('/recipes')
      }
    } catch (error) {
      console.error('Error fetching recipe:', error)
    } finally {
      setFetchLoading(false)
    }
  }, [params.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name === 'servings' || name === 'prepTime' || name === 'cookTime') {
      setFormData({
        ...formData,
        [name]: value === '' ? undefined : parseInt(value),
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        structuredIngredients: structuredIngredients.map(ing => ({
          amount: ing.amount,
          unit: ing.unit,
          name: ing.name,
          optional: ing.optional,
          notes: ing.notes,
        })),
      }

      const response = await fetch(`/api/recipes/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setShowSuccess(true)
        setTimeout(() => {
          router.push(`/recipes/${params.id}`)
        }, 2000)
      }
    } catch (error) {
      console.error('Error updating recipe:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipe()
  }, [params.id, fetchRecipe])

  if (fetchLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Loading recipe...</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          Edit Recipe
        </Typography>
      </Box>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Update your recipe details
      </Typography>

      <Paper elevation={2} sx={{ p: 4, maxWidth: 800 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                label="Servings"
                name="servings"
                type="number"
                value={formData.servings}
                onChange={handleChange}
                inputProps={{ min: 1 }}
                sx={{ width: 120 }}
              />
              <TextField
                label="Prep Time (minutes)"
                name="prepTime"
                type="number"
                value={formData.prepTime || ''}
                onChange={handleChange}
                inputProps={{ min: 0 }}
                sx={{ width: 180 }}
              />
              <TextField
                label="Cook Time (minutes)"
                name="cookTime"
                type="number"
                value={formData.cookTime || ''}
                onChange={handleChange}
                inputProps={{ min: 0 }}
                sx={{ width: 180 }}
              />
            </Box>
            
            <IngredientInput
              ingredients={structuredIngredients}
              onChange={setStructuredIngredients}
            />
            
            <TextField
              fullWidth
              label="Instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              multiline
              rows={8}
              required
              helperText="Step-by-step cooking instructions"
            />
            
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
                disabled={loading}
                startIcon={<Save />}
                sx={{ minWidth: 140 }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
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
          Recipe updated successfully! Redirecting...
        </Alert>
      </Snackbar>
    </Box>
  )
}