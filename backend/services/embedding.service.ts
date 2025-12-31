/**
 * Embedding Service
 * 
 * Generates embedding vectors from text using OpenAI's API.
 * This abstraction allows for easy switching of embedding providers in the future.
 */

interface EmbeddingResult {
  embedding: number[];
  model: string;
}

/**
 * Generate embedding vector from text
 * @param text - The text to generate embeddings for
 * @returns Object containing the embedding vector and model used
 */
export async function generateEmbedding(text: string): Promise<EmbeddingResult> {
  if (!text || text.trim().length === 0) {
    throw new Error('Text content is required for embedding generation');
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const model = 'text-embedding-3-small';

  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        input: text,
        model: model
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    
    if (!data.data || !data.data[0] || !data.data[0].embedding) {
      throw new Error('Invalid response format from OpenAI API');
    }

    const embedding = data.data[0].embedding;

    return {
      embedding,
      model
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
    throw new Error('Failed to generate embedding: Unknown error');
  }
}
