'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  CardActions,
  Chip,
} from '@mui/material'
import { Add, Restaurant, Visibility } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

interface Recipe {
  id: string
  title: string
  author: string
  ingredients: string
  servings: number
  prepTime?: number
  cookTime?: number
  structuredIngredients?: Array<{
    id: number
    amount: number
    unit: string
    name: string
    optional: boolean
    notes?: string
  }>
  createdAt?: string
}

export default function Home() {
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([])
  const router = useRouter()

  const fetchRecentRecipes = async () => {
    try {
      const response = await fetch('/api/recipes')
      if (response.ok) {
        const data = await response.json()
        // Get the 3 most recent recipes
        const recent = data.slice(-3).reverse()
        setRecentRecipes(recent)
      }
    } catch (error) {
      console.error('Error fetching recipes:', error)
    }
  }

  useEffect(() => {
    fetchRecentRecipes()
  }, [])

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 6,
          mb: 4,
          borderRadius: 2,
        }}
      >
        <Box sx={{ textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to FoodDB
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => router.push('/add-recipe')}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Add Recipe
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Restaurant />}
              onClick={() => router.push('/recipes')}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Browse Recipes
            </Button>
          </Box>
        </Box>
      </Paper>


      {/* Recent Recipes Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Recent Recipes
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Check out the latest additions to our recipe collection
        </Typography>

        {recentRecipes.length > 0 ? (
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {recentRecipes.map((recipe) => (
              <Box key={recipe.id} sx={{ flex: 1, minWidth: 300 }}>
                <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {recipe.title}
                    </Typography>
                    <Chip
                      label={recipe.author}
                      size="small"
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {recipe.ingredients.substring(0, 100)}...
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => router.push(`/recipes/${recipe.id}`)}
                    >
                      View Recipe
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        ) : (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No recipes yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Be the first to add a recipe to our collection!
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push('/add-recipe')}
            >
              Add First Recipe
            </Button>
          </Paper>
        )}
      </Box>

      {/* Call to Action */}
      <Paper elevation={2} sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
        <Typography variant="h5" gutterBottom>
          Ready to start cooking?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Join our community of food lovers and share your favorite recipes
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={() => router.push('/add-recipe')}
        >
          Share Your Recipe
        </Button>
      </Paper>
    </Box>
  )
}
