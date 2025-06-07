import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const recipe = await prisma.recipe.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        structuredIngredients: true,
      },
    })

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Failed to fetch recipe:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipe' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const { title, author, instructions, ingredients, servings, prepTime, cookTime, structuredIngredients } = await request.json()

    const recipe = await prisma.recipe.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        author,
        instructions,
        ingredients,
        servings,
        prepTime,
        cookTime,
        structuredIngredients: {
          deleteMany: {}, // Delete existing ingredients
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

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Failed to update recipe:', error)
    return NextResponse.json(
      { error: 'Failed to update recipe' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    await prisma.recipe.delete({
      where: {
        id: parseInt(id),
      },
    })

    return NextResponse.json({ message: 'Recipe deleted successfully' })
  } catch (error) {
    console.error('Failed to delete recipe:', error)
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 }
    )
  }
}