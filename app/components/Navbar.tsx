'use client'

import { AppBar, Toolbar, Typography, Button, Box, IconButton, Tooltip } from '@mui/material'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Restaurant, Add, List, Logout } from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const navItems = [
    { label: 'Home', href: '/', icon: <Restaurant /> },
    { label: 'Recipes', href: '/recipes', icon: <List /> },
    { label: 'Add Recipe', href: '/add-recipe', icon: <Add /> },
  ]

  const handleLogout = () => {
    logout()
  }

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          FoodDB
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
          <Tooltip title="Logout">
            <IconButton
              color="inherit"
              onClick={handleLogout}
              sx={{
                ml: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <Logout />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}