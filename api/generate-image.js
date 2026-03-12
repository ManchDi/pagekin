export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }

  try {
    const encoded = encodeURIComponent(
      `children's storybook illustration, whimsical, colorful, cartoon style: ${prompt}`
    );
    const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&nologo=true`;

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Image generation error:', error.message);
    res.status(500).json({ error: error.message || 'Image generation failed' });
  }
}