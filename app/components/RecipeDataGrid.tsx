'use client'

import { useState, useEffect } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Paper, Typography, Box } from '@mui/material'

interface Recipe {
  id: string
  title: string
  author: string
  instructions: string
  ingredients: string
  createdAt?: string
}

interface RecipeDataGridProps {
  refreshTrigger: number
}

export default function RecipeDataGrid({ refreshTrigger }: RecipeDataGridProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'author', headerName: 'Author', width: 150 },
    { 
      field: 'ingredients', 
      headerName: 'Ingredients', 
      width: 300,
      renderCell: (params) => (
        <Box sx={{ whiteSpace: 'pre-wrap', py: 1 }}>
          {params.value}
        </Box>
      )
    },
    { 
      field: 'instructions', 
      headerName: 'Instructions', 
      width: 400,
      renderCell: (params) => (
        <Box sx={{ whiteSpace: 'pre-wrap', py: 1 }}>
          {params.value}
        </Box>
      )
    },
  ]

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/recipes')
      if (response.ok) {
        const data = await response.json()
        setRecipes(data)
      }
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipes()
  }, [refreshTrigger])

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Recipe Collection
      </Typography>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={recipes}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          getRowHeight={() => 'auto'}
          sx={{
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
            },
          }}
        />
      </Box>
    </Paper>
  )
}