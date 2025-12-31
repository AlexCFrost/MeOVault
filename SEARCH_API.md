# Search API Testing Guide

## Endpoint

**POST** `/api/search`

## Request Body

```json
{
  "query": "peaceful evening memories",
  "limit": 10  // optional, defaults to 10, max 50
}
```

## Response Format

```json
{
  "success": true,
  "data": {
    "query": "peaceful evening memories",
    "results": [
      {
        "_id": "...",
        "content": "Note content here...",
        "createdAt": "2025-12-31T...",
        "score": 0.95
      }
    ],
    "count": 5
  }
}
```

## Testing with curl

```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "peaceful evening memories"}'
```

## Testing with Postman

1. Create a new POST request
2. URL: `http://localhost:3000/api/search`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "query": "your search query here"
}
```

## Test Queries

Try these semantic searches:
- "peaceful evening memories"
- "happy moments with friends"
- "work accomplishments"
- "travel experiences"
- "creative ideas"

## MongoDB Atlas Vector Search Index

**Important**: You need to create a vector search index in MongoDB Atlas for this to work.

### Index Configuration

1. Go to your MongoDB Atlas cluster
2. Navigate to "Atlas Search" → "Create Search Index"
3. Choose "JSON Editor"
4. Use this configuration:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,
      "similarity": "cosine"
    }
  ]
}
```

5. Name the index: `vector_index`
6. Select your database and `notes` collection
7. Create the index

The index will take a few minutes to build. Once it's ready, your search endpoint will work!

## Error Responses

### Missing Query
```json
{
  "success": false,
  "error": "Search query is required and must be a non-empty string"
}
```

### OpenAI API Error
```json
{
  "success": false,
  "error": "Failed to generate embedding: ..."
}
```
