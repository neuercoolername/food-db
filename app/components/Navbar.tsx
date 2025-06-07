'use client'

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Restaurant, Add, List } from '@mui/icons-material'

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Home', href: '/', icon: <Restaurant /> },
    { label: 'Recipes', href: '/recipes', icon: <List /> },
    { label: 'Add Recipe', href: '/add-recipe', icon: <Add /> },
  ]

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          FoodDB
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.href}
              component={Link}
              href={item.href}
              color="inherit"
              startIcon={item.icon}
              sx={{
                backgroundColor: pathname === item.href ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  )
}