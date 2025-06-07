'use client'

import { useState, useEffect } from 'react'
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid'
import { Paper, Typography, Box, Chip } from '@mui/material'
import { Visibility, Edit } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

interface Recipe {
  id: string
  title: string
  author: string
  instructions: string
  ingredients: string
  createdAt?: string
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const handleViewRecipe = (id: string) => {
    router.push(`/recipes/${id}`)
  }

  const handleEditRecipe = (id: string) => {
    router.push(`/recipes/${id}/edit`)
  }

  const columns: GridColDef[] = [
    { 
      field: 'title', 
      headerName: 'Title', 
      width: 250,
      renderCell: (params) => (
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'author', 
      headerName: 'Author', 
      width: 200,
      renderCell: (params) => (
        <Chip label={params.value} size="small" variant="outlined" />
      )
    },
    { 
      field: 'ingredients', 
      headerName: 'Ingredients Preview', 
      width: 300,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap',
          color: 'text.secondary'
        }}>
          {params.value?.substring(0, 50)}...
        </Typography>
      )
    },
    { 
      field: 'createdAt', 
      headerName: 'Created', 
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {params.value ? new Date(params.value).toLocaleDateString() : 'N/A'}
        </Typography>
      )
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Visibility />}
          label="View"
          onClick={() => handleViewRecipe(params.id as string)}
          key="view"
        />,
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => handleEditRecipe(params.id as string)}
          key="edit"
        />,
      ],
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
  }, [])

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        All Recipes
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Browse and manage your recipe collection
      </Typography>
      
      <Paper elevation={2} sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={recipes}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          disableRowSelectionOnClick
          sx={{
            border: 0,
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        />
      </Paper>
      
      {recipes.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No recipes found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start by adding your first recipe!
          </Typography>
        </Box>
      )}
    </Box>
  )
}