import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    const correctPassword = process.env.FOODDB_PASSWORD
    
    if (!correctPassword) {
      console.error('FOODDB_PASSWORD environment variable not set')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    
    const isValid = password === correctPassword
    
    return NextResponse.json({ isValid })
  } catch (error) {
    console.error('Password verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}