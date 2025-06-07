'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Divider,
  IconButton,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import {
  Edit,
  Delete,
  ArrowBack,
  Person,
  Schedule,
  AccessTime,
  Groups,
} from '@mui/icons-material'
import IngredientDisplay from '../../components/IngredientDisplay'

interface StructuredIngredient {
  id: number
  amount: number
  unit: string
  name: string
  optional: boolean
  notes?: string
}

interface Recipe {
  id: string
  title: string
  author: string
  instructions: string
  ingredients: string
  servings: number
  prepTime?: number
  cookTime?: number
  structuredIngredients: StructuredIngredient[]
  createdAt?: string
  updatedAt?: string
}

export default function RecipeViewPage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)
  const params = useParams()
  const router = useRouter()

  const fetchRecipe = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/recipes/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setRecipe(data)
      } else if (response.status === 404) {
        router.push('/recipes')
      }
    } catch (error) {
      console.error('Error fetching recipe:', error)
    } finally {
      setLoading(false)
    }
  }, [params.id, router])

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/recipes/${params.id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setDeleteDialogOpen(false)
        setShowDeleteSuccess(true)
        setTimeout(() => {
          router.push('/recipes')
        }, 2000)
      }
    } catch (error) {
      console.error('Error deleting recipe:', error)
    }
  }

  useEffect(() => {
    fetchRecipe()
  }, [params.id, fetchRecipe])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Loading recipe...</Typography>
      </Box>
    )
  }

  if (!recipe) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5">Recipe not found</Typography>
        <Button onClick={() => router.push('/recipes')} sx={{ mt: 2 }}>
          Back to Recipes
        </Button>
      </Box>
    )
  }

  const ingredientsList = recipe.ingredients.split('\n').filter(item => item.trim())
  const instructionsList = recipe.instructions.split('\n').filter(item => item.trim())

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {recipe.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => router.push(`/recipes/${recipe.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Paper elevation={2} sx={{ p: 4 }}>
        {/* Recipe Info Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person sx={{ color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">Author:</Typography>
              <Chip label={recipe.author} variant="outlined" size="small" />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Groups sx={{ color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">Serves:</Typography>
              <Chip label={`${recipe.servings} people`} variant="outlined" size="small" />
            </Box>

            {recipe.prepTime && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule sx={{ color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">Prep:</Typography>
                <Chip label={`${recipe.prepTime} min`} variant="outlined" size="small" />
              </Box>
            )}

            {recipe.cookTime && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime sx={{ color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">Cook:</Typography>
                <Chip label={`${recipe.cookTime} min`} variant="outlined" size="small" />
              </Box>
            )}
          </Box>

          {recipe.createdAt && (
            <Typography variant="caption" color="text.secondary">
              Created: {new Date(recipe.createdAt).toLocaleDateString()}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Ingredients Section */}
        <Box sx={{ mb: 4 }}>
          {recipe.structuredIngredients && recipe.structuredIngredients.length > 0 ? (
            <IngredientDisplay 
              ingredients={recipe.structuredIngredients}
              originalServings={recipe.servings}
              showScaling={true}
            />
          ) : (
            // Fallback to legacy ingredients display
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h5">Ingredients</Typography>
              </Box>
              <Box sx={{ pl: 2 }}>
                {ingredientsList.map((ingredient, index) => (
                  <Typography 
                    key={index} 
                    variant="body1" 
                    sx={{ mb: 1, '&:before': { content: '"• "', fontWeight: 'bold' } }}
                  >
                    {ingredient.trim()}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Instructions
          </Typography>
          <Box sx={{ pl: 2 }}>
            {instructionsList.map((instruction, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                  Step {index + 1}
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                  {instruction.trim()}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Recipe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &quot;{recipe.title}&quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showDeleteSuccess}
        autoHideDuration={6000}
        onClose={() => setShowDeleteSuccess(false)}
      >
        <Alert onClose={() => setShowDeleteSuccess(false)} severity="success">
          Recipe deleted successfully! Redirecting...
        </Alert>
      </Snackbar>
    </Box>
  )
}