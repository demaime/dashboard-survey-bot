import { MongoClient } from "mongodb"

// Forzar que esta ruta sea dinámica (runtime)
export const dynamic = 'force-dynamic'

export async function GET() {
  const client = new MongoClient(process.env.MONGODB_URI || "")
  
  try {
    await client.connect()
    const db = client.db("guazu-bot")
    const collection = db.collection("surveys")

    const surveys = await collection.find({}).sort({ createdAt: -1 }).toArray()
    
    console.log("Surveys found:", surveys.length)
    console.log("First survey sample:", JSON.stringify(surveys[0], null, 2))

    return Response.json(surveys)
  } catch (error) {
    console.error("Error fetching surveys:", error)
    return Response.json({ error: "Failed to fetch surveys" }, { status: 500 })
  } finally {
    await client.close()
  }
}
