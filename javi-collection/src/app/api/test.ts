// app/api/route.ts
import { NextResponse } from 'next/server'
import { connectToDataBase } from '../db/connectDB'

export async function GET(request: Request): Promise<NextResponse> {
  try {
    await connectToDataBase()
    console.log(request)
    // Lógica adicional aquí
    return NextResponse.json({ message: 'Conexión exitosa' }, { status: 200 })
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
