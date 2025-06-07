import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

export async function POST(request: NextRequest) {
  try {
    const { title, author, instructions, ingredients, servings, prepTime, cookTime, structuredIngredients } = await request.json()

    const recipe = await prisma.recipe.create({
      data: {
        title,
        author,
        instructions,
        ingredients, // Keep for backward compatibility
        servings: servings || 4,
        prepTime,
        cookTime,
        structuredIngredients: {
          create: structuredIngredients?.map((ingredient: {
            amount: number;
            unit: string;
            name: string;
            optional?: boolean;
            notes?: string;
          }) => ({
            amount: ingredient.amount,
            unit: ingredient.unit,
            name: ingredient.name,
            optional: ingredient.optional || false,
            notes: ingredient.notes,
          })) || [],
        },
      },
      include: {
        structuredIngredients: true,
      },
    })

    return NextResponse.json(recipe, { status: 201 })
  } catch (error) {
    console.error('Failed to create recipe:', error)
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        structuredIngredients: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(recipes)
  } catch (error) {
    console.error('Failed to fetch recipes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}