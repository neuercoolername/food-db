import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

export async function POST(request: NextRequest) {
  try {
    const { title, author, instructions, ingredients } = await request.json()
    
    const recipe = await prisma.recipe.create({
      data: {
        title,
        author,
        instructions,
        ingredients,
      },
    })
    
    return NextResponse.json(recipe, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany()
    return NextResponse.json(recipes)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}