/**
 * Copilot Academy - Kennistest API Worker
 * Cloudflare Worker for Gemini API Proxy
 *
 * Setup:
 * 1. Install wrangler: npm install -g wrangler
 * 2. Login: wrangler login
 * 3. Create worker: wrangler init kennistest-api
 * 4. Copy this file to src/index.js
 * 5. Set secret: wrangler secret put GEMINI_API_KEY
 * 6. Deploy: wrangler deploy
 */

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

// Evaluation prompt for Gemini - Universal criteria (no training knowledge required)
const EVALUATION_PROMPT = `Je bent een expert die AI-prompts beoordeelt op effectiviteit.

De gebruiker moest een prompt schrijven voor deze situatie:
"Je hebt een kwartaalrapport met sales cijfers, klanttevredenheid scores en marktanalyse. Je wilt dit samenvatten voor een MT-overleg."

Beoordeel de prompt op deze universele kwaliteitscriteria:

1. DUIDELIJKHEID (0-2): Is de vraag/opdracht helder geformuleerd?
   0 = onduidelijk wat gevraagd wordt
   1 = redelijk duidelijk maar kan beter
   2 = zeer helder en ondubbelzinnig

2. SPECIFICITEIT (0-2): Bevat de prompt concrete, specifieke details?
   0 = te vaag/algemeen
   1 = enkele details maar niet genoeg
   2 = goed gespecificeerd met relevante details

3. CONTEXT (0-2): Is er voldoende achtergrondinformatie voor de AI?
   0 = geen context gegeven
   1 = minimale context
   2 = goede context die AI helpt begrijpen

4. VERWACHTING (0-2): Is duidelijk welk resultaat/format gewenst is?
   0 = niet aangegeven wat voor output gewenst is
   1 = enigszins aangegeven
   2 = duidelijk beschreven welk resultaat verwacht wordt

5. EFFECTIVITEIT (0-2): Zou deze prompt een bruikbaar resultaat opleveren?
   0 = waarschijnlijk niet bruikbaar
   1 = redelijk maar met beperkingen
   2 = zeer waarschijnlijk een goed resultaat

De prompt om te beoordelen:
"""
{USER_PROMPT}
"""

Geef je beoordeling ALLEEN als valide JSON, zonder extra tekst:
{
  "duidelijkheid": {"score": 0, "feedback": "korte feedback in het Nederlands"},
  "specificiteit": {"score": 0, "feedback": "korte feedback in het Nederlands"},
  "context": {"score": 0, "feedback": "korte feedback in het Nederlands"},
  "verwachting": {"score": 0, "feedback": "korte feedback in het Nederlands"},
  "effectiviteit": {"score": 0, "feedback": "korte feedback in het Nederlands"},
  "totaal": 0
}`;

export default {
    async fetch(request, env, ctx) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: CORS_HEADERS });
        }

        // Only allow POST requests
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                status: 405,
                headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
            });
        }

        try {
            const { prompt } = await request.json();

            if (!prompt || prompt.length < 10) {
                return new Response(JSON.stringify({ error: 'Invalid prompt' }), {
                    status: 400,
                    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
                });
            }

            // Call Gemini API
            const evaluationPrompt = EVALUATION_PROMPT.replace('{USER_PROMPT}', prompt);

            const geminiResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: evaluationPrompt
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.2,
                            maxOutputTokens: 500,
                            thinkingConfig: { thinkingBudget: 0 }
                        }
                    })
                }
            );

            if (!geminiResponse.ok) {
                const errorText = await geminiResponse.text();
                console.error('Gemini API error:', errorText);
                throw new Error('Gemini API error');
            }

            const geminiData = await geminiResponse.json();

            // Extract the text response
            const textResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!textResponse) {
                throw new Error('No response from Gemini');
            }

            // Parse JSON from response (handle potential markdown code blocks)
            let jsonStr = textResponse.trim();
            if (jsonStr.startsWith('```json')) {
                jsonStr = jsonStr.slice(7);
            }
            if (jsonStr.startsWith('```')) {
                jsonStr = jsonStr.slice(3);
            }
            if (jsonStr.endsWith('```')) {
                jsonStr = jsonStr.slice(0, -3);
            }
            jsonStr = jsonStr.trim();

            const evaluation = JSON.parse(jsonStr);

            // Validate and ensure totaal is correct
            const calculatedTotal =
                (evaluation.duidelijkheid?.score || 0) +
                (evaluation.specificiteit?.score || 0) +
                (evaluation.context?.score || 0) +
                (evaluation.verwachting?.score || 0) +
                (evaluation.effectiviteit?.score || 0);

            evaluation.totaal = calculatedTotal;

            return new Response(JSON.stringify(evaluation), {
                headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
            });

        } catch (error) {
            console.error('Worker error:', error);

            // Return a fallback evaluation with debug info
            return new Response(JSON.stringify({
                duidelijkheid: { score: 1, feedback: "Kon niet automatisch beoordelen" },
                specificiteit: { score: 1, feedback: "Kon niet automatisch beoordelen" },
                context: { score: 1, feedback: "Kon niet automatisch beoordelen" },
                verwachting: { score: 1, feedback: "Kon niet automatisch beoordelen" },
                effectiviteit: { score: 1, feedback: "Kon niet automatisch beoordelen" },
                totaal: 5,
                error: true
            }), {
                headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
            });
        }
    },
};
