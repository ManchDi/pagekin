import { withGeminiRotation } from './_geminiWithRotation.js';

const AGE_GUIDELINES = {
  '2-4': {
    label: 'toddler (age 2-4)',
    rules: 'Use very simple words (max 2 syllables where possible). 1-2 short sentences per page. Lots of repetition and simple cause-effect. Think "The Very Hungry Caterpillar" level.',
  },
  '5-7': {
    label: 'early reader (age 5-7)',
    rules: 'Simple sentences, common words. 2-3 sentences per page. Light adventure, clear emotions, simple problem-solving. Think early Dr. Seuss or "Frog and Toad" level.',
  },
  '8-10': {
    label: 'confident reader (age 8-10)',
    rules: '3-4 sentences per page. Can use richer vocabulary and more complex ideas. Characters can have inner thoughts and motivations. Think short chapter book level.',
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { childName, theme, pageCount, includeChild, ageRange, pageIndex, previousPages } = req.body;
  if (!theme || pageIndex === undefined) return res.status(400).json({ error: 'theme and pageIndex are required' });

  const age = AGE_GUIDELINES[ageRange] || AGE_GUIDELINES['5-7'];
  const childContext = includeChild && childName
    ? `The main character of the story is a child named ${childName}.`
    : 'The story features a lovable animal character.';
  const previousContext = previousPages?.length > 0
    ? `Here is the story so far:\n${previousPages.map((p, i) => `Page ${i + 1}: ${p}`).join('\n')}\n\nNow write page ${pageIndex + 1}.`
    : `This is the first page of the story.`;
  const isLastPage = pageIndex === pageCount - 1;

  const prompt = `You are writing a children's storybook for a ${age.label}.
${childContext}
Story theme: "${theme}"
Total pages: ${pageCount}
${previousContext}

Write page ${pageIndex + 1} of ${pageCount}.
${isLastPage ? 'This is the final page — give the story a warm, satisfying ending.' : 'End this page on a moment that makes the reader want to turn the page.'}

Writing rules for this age group:
- ${age.rules}
- Warm, imaginative, and age-appropriate
- ${includeChild && childName ? `Use the name "${childName}" naturally` : 'Keep the character consistent throughout'}

Then on a new line write: IMAGE_PROMPT: [a vivid illustration prompt in children's picture book watercolor style]

Respond with ONLY the page text and the IMAGE_PROMPT line. No labels, no page numbers.`;

  try {
    const result = await withGeminiRotation(async (ai) => {
      return await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
      });
    });

    const raw = result.text.trim();
    const imagePromptMatch = raw.match(/IMAGE_PROMPT:\s*(.+)/s);
    const imagePrompt = imagePromptMatch ? imagePromptMatch[1].trim() : `A children's book illustration for: ${theme}`;
    const text = raw.replace(/IMAGE_PROMPT:[\s\S]*$/, '').trim();

    res.status(200).json({ text, imagePrompt });
  } catch (error) {
    console.error('Story generation error:', error.message);
    const status = error?.status === 429 ? 429 : 500;
    res.status(status).json({ error: error.message, service: 'story' });
  }
}