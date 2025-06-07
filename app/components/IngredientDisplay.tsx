'use client'

import { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Chip,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material'
import { Restaurant, Scale, RestartAlt } from '@mui/icons-material'

interface StructuredIngredient {
  id: number
  amount: number
  unit: string
  name: string
  optional: boolean
  notes?: string
}

interface IngredientDisplayProps {
  ingredients: StructuredIngredient[]
  originalServings: number
  showScaling?: boolean
}

export default function IngredientDisplay({ 
  ingredients, 
  originalServings, 
  showScaling = true 
}: IngredientDisplayProps) {
  const [targetServings, setTargetServings] = useState(originalServings)

  const scalingFactor = targetServings / originalServings

  const scaleAmount = (amount: number): string => {
    const scaledAmount = amount * scalingFactor
    
    // Handle fractions nicely for common cooking amounts
    if (scaledAmount < 1) {
      // Convert to fractions for small amounts
      const fractions = [
        { decimal: 0.125, display: '1/8' },
        { decimal: 0.25, display: '1/4' },
        { decimal: 0.333, display: '1/3' },
        { decimal: 0.5, display: '1/2' },
        { decimal: 0.667, display: '2/3' },
        { decimal: 0.75, display: '3/4' },
      ]
      
      for (const fraction of fractions) {
        if (Math.abs(scaledAmount - fraction.decimal) < 0.05) {
          return fraction.display
        }
      }
    }
    
    // For larger amounts, show decimals only if necessary
    if (scaledAmount % 1 === 0) {
      return scaledAmount.toString()
    } else if (scaledAmount < 10) {
      return scaledAmount.toFixed(2).replace(/\.?0+$/, '')
    } else {
      return scaledAmount.toFixed(1)
    }
  }

  const resetServings = () => {
    setTargetServings(originalServings)
  }

  if (ingredients.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No structured ingredients available for this recipe.
        </Typography>
      </Paper>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Restaurant sx={{ color: 'primary.main' }} />
          <Typography variant="h5">Ingredients</Typography>
        </Box>
        
        {showScaling && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Scale sx={{ color: 'secondary.main' }} />
            <Typography variant="body2">Scale for:</Typography>
            <TextField
              type="number"
              value={targetServings}
              onChange={(e) => setTargetServings(parseInt(e.target.value) || 1)}
              inputProps={{ min: 1, max: 100 }}
              sx={{ width: 80 }}
              size="small"
            />
            <Typography variant="body2">servings</Typography>
            <Tooltip title="Reset to original">
              <IconButton onClick={resetServings} size="small">
                <RestartAlt />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      {showScaling && targetServings !== originalServings && (
        <Box sx={{ mb: 2 }}>
          <Chip
            label={`Scaled from ${originalServings} to ${targetServings} servings (${scalingFactor.toFixed(1)}x)`}
            color="secondary"
            variant="outlined"
          />
        </Box>
      )}

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Unit</strong></TableCell>
              <TableCell><strong>Ingredient</strong></TableCell>
              <TableCell><strong>Notes</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow 
                key={ingredient.id}
                sx={{ 
                  '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                  opacity: ingredient.optional ? 0.7 : 1,
                }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {showScaling ? scaleAmount(ingredient.amount) : ingredient.amount}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {ingredient.unit}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">
                      {ingredient.name}
                    </Typography>
                    {ingredient.optional && (
                      <Chip 
                        label="optional" 
                        size="small" 
                        variant="outlined" 
                        color="secondary"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    {ingredient.notes || '—'}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          💡 <strong>Tip:</strong> Use the scaling controls above to adjust ingredient amounts for different serving sizes.
          {ingredients.some(ing => ing.optional) && ' Optional ingredients are marked and shown with reduced opacity.'}
        </Typography>
      </Box>
    </Box>
  )
}