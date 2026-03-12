import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { childName, theme, pageCount, includeChild, pageIndex, previousPages } = req.body;

  if (!theme || pageIndex === undefined) {
    return res.status(400).json({ error: 'theme and pageIndex are required' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const childContext = includeChild && childName
      ? `The main character of the story is a child named ${childName}.`
      : 'The story features a lovable animal character.';

    const previousContext = previousPages && previousPages.length > 0
      ? `Here is the story so far:\n${previousPages.map((p, i) => `Page ${i + 1}: ${p}`).join('\n')}\n\nNow write page ${pageIndex + 1}.`
      : `This is the first page of the story.`;

    const isLastPage = pageIndex === pageCount - 1;

    const prompt = `You are writing a children's storybook. ${childContext}
The story theme is: "${theme}"
The story is ${pageCount} pages long.
${previousContext}

Write page ${pageIndex + 1} of ${pageCount}.
${isLastPage ? 'This is the final page — give the story a warm, satisfying ending.' : 'End this page on a moment that makes the reader want to turn the page.'}

Rules:
- 2-4 sentences only, simple language for young children
- Warm, imaginative, and age-appropriate
- ${includeChild && childName ? `Use the name "${childName}" naturally` : 'Keep the character consistent'}

Then on a new line write: IMAGE_PROMPT: [a detailed image generation prompt for this page in the style of a children's book illustration]

Respond with ONLY the page text and the IMAGE_PROMPT line. No labels, no page numbers.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
    });

    const raw = response.text.trim();
    const imagePromptMatch = raw.match(/IMAGE_PROMPT:\s*(.+)/s);
    const imagePrompt = imagePromptMatch ? imagePromptMatch[1].trim() : `A children's book illustration for: ${theme}`;
    const text = raw.replace(/IMAGE_PROMPT:[\s\S]*$/, '').trim();

    res.status(200).json({ text, imagePrompt });
  } catch (error) {
    console.error('Story generation error:', error.message);
    const status = error?.status === 429 ? 429 : 500;
    res.status(status).json({ error: error.message || 'Story generation failed' });
  }
}