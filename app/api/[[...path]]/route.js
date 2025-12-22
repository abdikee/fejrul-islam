import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

// MongoDB connection
let client
let db

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

// Helper function to handle CORS
function handleCORS(response, allowedOrigin) {
  if (!allowedOrigin) return response

  response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
  response.headers.append('Vary', 'Origin')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

function getAllowedCorsOrigin(request) {
  const requestOrigin = request.headers.get('origin')
  if (!requestOrigin) return null

  const allowed = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if (allowed.length === 0) return null
  return allowed.includes(requestOrigin) ? requestOrigin : null
}

// OPTIONS handler for CORS
export async function OPTIONS(request) {
  const allowedOrigin = getAllowedCorsOrigin(request)
  return handleCORS(new NextResponse(null, { status: 204 }), allowedOrigin)
}

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    const allowedOrigin = getAllowedCorsOrigin(request)

    // Root endpoint - GET /api/root (since /api/ is not accessible with catch-all)
    if (route === '/root' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: "Hello World" }), allowedOrigin)
    }
    // Root endpoint - GET /api/root (since /api/ is not accessible with catch-all)
    if (route === '/' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: "Hello World" }), allowedOrigin)
    }

    // Status endpoints - POST /api/status
    if (route === '/status' && method === 'POST') {
      const body = await request.json()
      
      if (!body.client_name) {
        return handleCORS(NextResponse.json(
          { error: "client_name is required" }, 
          { status: 400 }
        ), allowedOrigin)
      }

      const statusObj = {
        id: uuidv4(),
        client_name: body.client_name,
        timestamp: new Date()
      }

      await db.collection('status_checks').insertOne(statusObj)
      return handleCORS(NextResponse.json(statusObj), allowedOrigin)
    }

    // Status endpoints - GET /api/status
    if (route === '/status' && method === 'GET') {
      const statusChecks = await db.collection('status_checks')
        .find({})
        .limit(1000)
        .toArray()

      // Remove MongoDB's _id field from response
      const cleanedStatusChecks = statusChecks.map(({ _id, ...rest }) => rest)
      
      return handleCORS(NextResponse.json(cleanedStatusChecks), allowedOrigin)
    }

    // Route not found
    const notFoundRes = NextResponse.json(
      { error: `Route ${route} not found` }, 
      { status: 404 }
    )
    return handleCORS(notFoundRes, allowedOrigin)

  } catch (error) {
    console.error('API Error:', error)
    const errRes = NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    )
    const allowedOrigin = getAllowedCorsOrigin(request)
    return handleCORS(errRes, allowedOrigin)
  }
}

// Export all HTTP methods
export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute