import { Modality } from '@google/genai';
import { withGeminiRotation } from './_geminiWithRotation.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text is required' });

  try {
    const response = await withGeminiRotation(async (ai) => {
      return await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text: `Read this in a friendly, gentle storyteller voice: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) throw new Error('No audio data returned from API');

    res.status(200).json({ audioData });
  } catch (error) {
    console.error('Speech generation error:', error.message);
    const status = error?.status === 429 ? 429 : 500;
    res.status(status).json({ error: error.message, service: 'speech' });
  }
}