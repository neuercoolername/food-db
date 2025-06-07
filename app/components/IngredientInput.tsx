'use client'

import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  IconButton,
  Paper,
  Typography,
  MenuItem,
  Chip,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { Add, Delete } from '@mui/icons-material'

export interface StructuredIngredient {
  id?: number
  amount: number
  unit: string
  name: string
  optional: boolean
  notes?: string
}

interface IngredientInputProps {
  ingredients: StructuredIngredient[]
  onChange: (ingredients: StructuredIngredient[]) => void
}

const COMMON_UNITS = [
  'cups',
  'tbsp',
  'tsp',
  'oz',
  'lbs',
  'g',
  'kg',
  'ml',
  'l',
  'pieces',
  'cloves',
  'slices',
  'whole',
  'pinch',
  'dash',
  'to taste',
]

export default function IngredientInput({ ingredients, onChange }: IngredientInputProps) {
  const [newIngredient, setNewIngredient] = useState<StructuredIngredient>({
    amount: 1,
    unit: 'cups',
    name: '',
    optional: false,
    notes: '',
  })

  const handleAddIngredient = () => {
    if (newIngredient.name.trim()) {
      onChange([...ingredients, { ...newIngredient }])
      setNewIngredient({
        amount: 1,
        unit: 'cups',
        name: '',
        optional: false,
        notes: '',
      })
    }
  }

  const handleRemoveIngredient = (index: number) => {
    const updated = ingredients.filter((_, i) => i !== index)
    onChange(updated)
  }

  const handleUpdateIngredient = (index: number, field: keyof StructuredIngredient, value: string | number | boolean) => {
    const updated = ingredients.map((ingredient, i) =>
      i === index ? { ...ingredient, [field]: value } : ingredient
    )
    onChange(updated)
  }

  const formatIngredientDisplay = (ingredient: StructuredIngredient) => {
    const amountStr = ingredient.amount % 1 === 0 ? ingredient.amount.toString() : ingredient.amount.toFixed(2)
    return `${amountStr} ${ingredient.unit} ${ingredient.name}${ingredient.optional ? ' (optional)' : ''}`
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Ingredients
      </Typography>
      
      {/* Add new ingredient form */}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Add Ingredient
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label="Amount"
            type="number"
            value={newIngredient.amount}
            onChange={(e) => setNewIngredient({
              ...newIngredient,
              amount: parseFloat(e.target.value) || 0
            })}
            sx={{ width: 100 }}
            inputProps={{ min: 0, step: 0.25 }}
          />
          <TextField
            select
            label="Unit"
            value={newIngredient.unit}
            onChange={(e) => setNewIngredient({
              ...newIngredient,
              unit: e.target.value
            })}
            sx={{ width: 120 }}
          >
            {COMMON_UNITS.map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Ingredient Name"
            value={newIngredient.name}
            onChange={(e) => setNewIngredient({
              ...newIngredient,
              name: e.target.value
            })}
            sx={{ flexGrow: 1, minWidth: 200 }}
            placeholder="e.g., flour, chicken breast, onion"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newIngredient.optional}
                onChange={(e) => setNewIngredient({
                  ...newIngredient,
                  optional: e.target.checked
                })}
              />
            }
            label="Optional"
          />
          <Button
            variant="contained"
            onClick={handleAddIngredient}
            startIcon={<Add />}
            disabled={!newIngredient.name.trim()}
          >
            Add
          </Button>
        </Box>
        <TextField
          fullWidth
          label="Notes (optional)"
          value={newIngredient.notes}
          onChange={(e) => setNewIngredient({
            ...newIngredient,
            notes: e.target.value
          })}
          sx={{ mt: 2 }}
          placeholder="e.g., finely chopped, room temperature"
        />
      </Paper>

      {/* Ingredients list */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {ingredients.map((ingredient, index) => (
          <Paper key={index} elevation={1} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Amount"
                type="number"
                value={ingredient.amount}
                onChange={(e) => handleUpdateIngredient(index, 'amount', parseFloat(e.target.value) || 0)}
                sx={{ width: 100 }}
                inputProps={{ min: 0, step: 0.25 }}
                size="small"
              />
              <TextField
                select
                label="Unit"
                value={ingredient.unit}
                onChange={(e) => handleUpdateIngredient(index, 'unit', e.target.value)}
                sx={{ width: 120 }}
                size="small"
              >
                {COMMON_UNITS.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Name"
                value={ingredient.name}
                onChange={(e) => handleUpdateIngredient(index, 'name', e.target.value)}
                sx={{ flexGrow: 1, minWidth: 200 }}
                size="small"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={ingredient.optional}
                    onChange={(e) => handleUpdateIngredient(index, 'optional', e.target.checked)}
                  />
                }
                label="Optional"
              />
              <IconButton
                color="error"
                onClick={() => handleRemoveIngredient(index)}
                size="small"
              >
                <Delete />
              </IconButton>
            </Box>
            {ingredient.notes && (
              <TextField
                fullWidth
                label="Notes"
                value={ingredient.notes}
                onChange={(e) => handleUpdateIngredient(index, 'notes', e.target.value)}
                sx={{ mt: 2 }}
                size="small"
              />
            )}
            <Box sx={{ mt: 1 }}>
              <Chip
                label={formatIngredientDisplay(ingredient)}
                variant="outlined"
                size="small"
              />
            </Box>
          </Paper>
        ))}
      </Box>

      {ingredients.length === 0 && (
        <Paper elevation={1} sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
          <Typography color="text.secondary">
            No ingredients added yet. Use the form above to add your first ingredient.
          </Typography>
        </Paper>
      )}
    </Box>
  )
}