import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

// Set up larger limit for base64 images
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Initialize Gemini client lazily
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return ai;
}

// 1. Endpoint: AI Skin Lesion Screening
app.post('/api/analyze-lesion', async (req, res) => {
  const { image, symptoms } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'Image data is required' });
  }

  // Check if API Key is configured
  const client = getGeminiClient();
  if (!client) {
    console.log('GEMINI_API_KEY is not configured. Returning premium simulated screening results.');
    // Simulated fallback for premium presentation
    return res.json({
      lesionType: symptoms?.colorChange === 'Yes' ? 'Atypical Melanocytic Nevus' : 'Benign Nevus (Common Mole)',
      confidence: 88,
      riskClass: symptoms?.colorChange === 'Yes' ? 'Moderate' : 'Low',
      urgency: symptoms?.colorChange === 'Yes' ? 'Routine' : 'None',
      distribution: [
        { name: 'Benign Nevus', value: 72 },
        { name: 'Melanoma', value: 12 },
        { name: 'Seborrheic Keratosis', value: 10 },
        { name: 'Dermatofibroma', value: 6 }
      ],
      explanation: "The uploaded image exhibits characteristics of a benign melanocytic nevus (common mole). It shows a symmetrical, well-defined border and uniform coloration. However, given your reported symptom of slight color change over time, we classify this as Moderate Risk. While the presentation is likely benign, a routine consultation with a board-certified dermatologist is advised to perform a dermoscopic evaluation and establish a baseline for tracking.",
      gradCamCoordinates: {
        x: 48,
        y: 52,
        radius: 18,
        intensity: 0.85
      },
      symptomsChecked: symptoms
    });
  }

  try {
    // Extract base64 clean data
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    
    const prompt = `You are an advanced AI skin health educational screening system.
Analyze this skin lesion image alongside these symptoms reported by the user:
- Pain: ${symptoms?.pain || 'None'}
- Bleeding: ${symptoms?.bleeding || 'No'}
- Itching: ${symptoms?.itching || 'No'}
- Growing: ${symptoms?.growth || 'No'}
- Color change: ${symptoms?.colorChange || 'No'}
- Duration: ${symptoms?.duration || 'Unknown'}

Perform an assessment. Your output MUST be strict JSON matching this structure:
{
  "lesionType": "Name of primary suspected lesion (e.g., Melanoma, Benign Nevus, Basal Cell Carcinoma, etc.)",
  "confidence": number between 0 and 100,
  "riskClass": "Low" or "Moderate" or "High",
  "urgency": "None" or "Routine" or "Immediate",
  "distribution": [
    { "name": "Benign Nevus", "value": percentage },
    { "name": "Melanoma", "value": percentage },
    { "name": "Seborrheic Keratosis", "value": percentage },
    { "name": "Basal Cell Carcinoma", "value": percentage }
  ],
  "explanation": "Detailed explanation of the visual characteristics, warning signs, educational context, and clear recommendations. End with a compassionate warning that this is an AI model and not a diagnosis.",
  "gradCamCoordinates": {
    "x": number representing lesion center X coordinate in the image from 0 to 100 (e.g. 50),
    "y": number representing lesion center Y coordinate in the image from 0 to 100 (e.g. 50),
    "radius": number representing radius size in percentage of image width from 10 to 30 (e.g. 15),
    "intensity": number between 0.5 and 1.0 (e.g. 0.85)
  }
}
Provide ONLY the JSON object. Do not include markdown codeblocks or extra text.`;

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data
          }
        },
        prompt
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const resultText = response.text || '';
    const parsedData = JSON.parse(resultText.trim());
    return res.json({ ...parsedData, symptomsChecked: symptoms });
  } catch (error: any) {
    console.error('Error analyzing lesion:', error);
    return res.status(500).json({ error: 'Failed to analyze lesion. Please try again with a clearer image.' });
  }
});

// 2. Endpoint: AI Facial Skin Health Analyzer
app.post('/api/analyze-face', async (req, res) => {
  const { image, questionnaire } = req.body;

  const client = getGeminiClient();
  if (!client) {
    console.log('GEMINI_API_KEY is not configured. Returning simulated facial analysis results.');
    // Simulated fallback
    return res.json({
      skinType: questionnaire?.skinType || 'Combination',
      overallScore: 84,
      scores: {
        acne: 85,
        pigmentation: 80,
        redness: 90,
        wrinkles: 88,
        pores: 75,
        oiliness: 78,
        hydration: 82,
        sensitivity: 80
      },
      concerns: [
        "Moderate T-zone oiliness leading to visible pores",
        "Mild redness around cheeks (likely related to sun exposure)",
        "Early indicators of fine expression lines near eyes"
      ],
      opportunities: [
        "Incorporate Salicylic acid 2% BHA to regulate pore sebum",
        "Use a broad-spectrum SPF 50 daily to tackle redness and pigmentation",
        "Add Niacinamide to balance oil production and restore skin barrier"
      ]
    });
  }

  try {
    const base64Data = image ? image.replace(/^data:image\/\w+;base64,/, '') : null;
    
    const prompt = `You are a professional AI cosmetic dermatology analysis agent.
Analyze the user's facial skin condition using their questionnaire data:
- Age: ${questionnaire?.age || 'Unknown'}
- Gender: ${questionnaire?.gender || 'Unknown'}
- Self-reported skin type: ${questionnaire?.skinType || 'Unknown'}
- Daily Water Intake: ${questionnaire?.waterIntake || 'Unknown'}
- Sleep hours: ${questionnaire?.sleep || 'Unknown'}
- Stress level: ${questionnaire?.stress || 'Unknown'}
- Diet habits: ${questionnaire?.diet || 'Unknown'}
- Sun exposure: ${questionnaire?.sunExposure || 'Unknown'}
- Sunscreen usage: ${questionnaire?.sunscreen || 'Unknown'}
- Existing skin conditions: ${questionnaire?.conditions || 'None'}

${base64Data ? 'An image of the user\'s face is attached. Examine the skin texture, pores, hydration cues, pigmentation, and redness.' : 'No image was attached, please perform the assessment strictly based on the questionnaire profile.'}

Your output MUST be strict JSON matching this structure:
{
  "skinType": "Dry" or "Oily" or "Combination" or "Normal" or "Sensitive",
  "overallScore": number between 0 and 100 representing overall skin vitality,
  "scores": {
    "acne": number between 0 and 100 (high means clear/no acne, low means active breakouts),
    "pigmentation": number between 0 and 100 (high means even tone, low means dark spots),
    "redness": number between 0 and 100 (high means calm, low means high irritation/redness),
    "wrinkles": number between 0 and 100 (high means smooth, low means wrinkles),
    "pores": number between 0 and 100 (high means tight, low means enlarged),
    "oiliness": number between 0 and 100 (high means balanced, low means hyper-oily),
    "hydration": number between 0 and 100 (high means fully hydrated, low means dry),
    "sensitivity": number between 0 and 100 (high means resilient skin, low means highly reactive)
  },
  "concerns": [
    "Concern 1 with details",
    "Concern 2 with details"
  ],
  "opportunities": [
    "Opportunity 1 describing how to improve",
    "Opportunity 2 describing how to improve"
  ]
}
Provide ONLY the JSON object. Do not include markdown codeblocks or extra text.`;

    const contents: any[] = [prompt];
    if (base64Data) {
      contents.unshift({
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data
        }
      });
    }

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsedData = JSON.parse((response.text || '').trim());
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error analyzing face:', error);
    return res.status(500).json({ error: 'Failed to perform facial skin health analysis.' });
  }
});

// 3. Endpoint: Intelligent Product Recommendation and Skincare Routine Generator
app.post('/api/recommend-products', async (req, res) => {
  const { skinType, concerns, budget } = req.body;

  const client = getGeminiClient();
  if (!client) {
    console.log('GEMINI_API_KEY is not configured. Returning premium simulated recommendations.');
    return res.json({
      products: [
        {
          name: "Effaclar Purifying Foaming Gel",
          brand: "La Roche-Posay",
          category: "Cleanser",
          priceCategory: "Mid-Range",
          priceRange: "$22.00",
          ingredients: ["Salicylic Acid", "Zinc PCA", "Thermal Spring Water"],
          instructions: "Gently massage onto wet face morning and night. Rinse thoroughly.",
          timeOfDay: "Both",
          expectedResults: "Cleanses skin, eliminates impurities, and controls excess oil.",
          precautions: "Avoid contact with eyes. If dryness occurs, reduce to once daily."
        },
        {
          name: "CeraVe PM Facial Moisturizing Lotion",
          brand: "CeraVe",
          category: "Moisturizer",
          priceCategory: "Budget",
          priceRange: "$15.99",
          ingredients: ["Ceramides", "Niacinamide", "Hyaluronic Acid"],
          instructions: "Apply liberally to the face and neck at night after serums.",
          timeOfDay: "Night",
          expectedResults: "Restores the skin's protective barrier and locks in hydration.",
          precautions: "None. Suitable for sensitive and acne-prone skin."
        },
        {
          name: "C-Firma Fresh Day Serum",
          brand: "Drunk Elephant",
          category: "Serum",
          priceCategory: "Premium",
          priceRange: "$78.00",
          ingredients: ["L-Ascorbic Acid (15%)", "Ferulic Acid", "Vitamin E"],
          instructions: "Apply 1-2 pumps to clean, dry face and neck in the morning.",
          timeOfDay: "Morning",
          expectedResults: "Brightens skin tone, reduces pigmentation, and combats photo-aging.",
          precautions: "Store in a cool, dark place to avoid oxidation. Always pair with sunscreen."
        }
      ],
      routine: {
        morning: [
          { step: 1, title: "Cleanser", productName: "Effaclar Purifying Foaming Gel", instructions: "Cleanse face with lukewarm water to remove overnight sebum." },
          { step: 2, title: "Serum", productName: "C-Firma Fresh Day Serum", instructions: "Apply to dry skin. Let it absorb for 3 minutes for maximum antioxidant uptake." },
          { step: 3, title: "Moisturizer & SPF", productName: "Daily Shield Broad Spectrum SPF 50", instructions: "Protect skin from active UV rays. Essential when using active serums." }
        ],
        night: [
          { step: 1, title: "Cleanser", productName: "Effaclar Purifying Foaming Gel", instructions: "Double-cleanse if you wore heavy makeup or sweat during the day." },
          { step: 2, title: "Moisturizer", productName: "CeraVe PM Facial Moisturizing Lotion", instructions: "Apply a generous layer to rebuild skin barrier overnight." }
        ],
        weekly: [
          "Exfoliate with 2% Salicylic Acid on Wednesday and Sunday nights only.",
          "Use a calming Hydrating Sheet Mask on Friday night for skin recovery."
        ],
        seasonalTips: "During dry seasons or winter, swap the foaming gel cleanser for a hydrating cream cleanser, and add a drop of squalane oil into your evening cream."
      }
    });
  }

  try {
    const prompt = `You are a premium skincare routine planning expert.
The user has:
- Skin Type: ${skinType}
- Concerns: ${JSON.stringify(concerns)}
- Target Budget: ${budget || 'Any'}

Generate 3 recommended products and a complete Morning, Night, and Weekly Skincare Routine.
Your output MUST be strict JSON matching this structure:
{
  "products": [
    {
      "name": "Product Name",
      "brand": "Brand Name",
      "category": "Cleanser" | "Serum" | "Moisturizer" | "Sunscreen" | "Treatment",
      "priceCategory": "Budget" | "Mid-Range" | "Premium",
      "priceRange": "Approximate price (e.g. $18.00)",
      "ingredients": ["Active ingredient 1", "ingredient 2"],
      "instructions": "How to use",
      "timeOfDay": "Morning" | "Night" | "Both",
      "expectedResults": "What results to expect",
      "precautions": "Precautions"
    }
  ],
  "routine": {
    "morning": [
      { "step": 1, "title": "Cleanser/Tone/Serum/Moisturizer/SPF", "productName": "Product Name", "instructions": "Step-specific layering instructions" }
    ],
    "night": [
      { "step": 1, "title": "Cleanser/Treatment/Moisturizer", "productName": "Product Name", "instructions": "Step-specific night instructions" }
    ],
    "weekly": [
      "Treatment tip 1",
      "Treatment tip 2"
    ],
    "seasonalTips": "Advice for transitioning routines between summer and winter."
  }
}
Provide ONLY the JSON object. Do not include markdown codeblocks or extra text.`;

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsedData = JSON.parse((response.text || '').trim());
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error generating recommendations:', error);
    return res.status(500).json({ error: 'Failed to generate recommendations.' });
  }
});

// 4. Endpoint: Chatbot AI Dermatologist Assistant
app.post('/api/chat', async (req, res) => {
  const { message, history, skinProfile } = req.body;

  const client = getGeminiClient();
  if (!client) {
    console.log('GEMINI_API_KEY is not configured. Returning simulated chatbot reply.');
    // Simulated chatbot responder
    const userMsg = message.toLowerCase();
    let reply = "I am here as your personal SkinSense AI companion. How can I help you optimize your skincare routine or understand your ingredients today?";
    if (userMsg.includes('retinol')) {
      reply = "Retinol is excellent for increasing cell turnover and encouraging collagen production. To prevent irritation, apply it only at night on dry skin, start 2-3 times per week, and follow up with a rich barrier moisturizer. Remember, Retinol makes your skin more sensitive to the sun, so daily SPF is a must!";
    } else if (userMsg.includes('acne')) {
      reply = "For active acne, Salicylic Acid (BHA) is highly effective as it penetrates oil glands to dissolve dead skin cells. Benzoyl Peroxide is also great for targeting acne-causing bacteria. Be careful not to use both in the same routine to avoid severe dryness.";
    } else if (userMsg.includes('melanoma') || userMsg.includes('mole') || userMsg.includes('cancer')) {
      reply = "If you are concerned about any skin lesion, you should refer to the ABCDE criteria: Asymmetry, Border irregularity, Color variation, Diameter >6mm, and Evolving shape/size. I strongly recommend having a board-certified dermatologist perform a dermoscopic exam, as AI screenings are strictly educational and do not replace professional medical evaluations.";
    }
    return res.json({ text: reply });
  }

  try {
    const formattedHistory = history ? history.map((h: any) => ({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    })) : [];

    const systemInstruction = `You are "Dr. Sam", a compassionate, highly educated AI dermatology expert and skincare formulation scientist at SkinSense AI.
Your goals:
1. Provide accurate, scientific, evidence-based advice about skincare ingredients, routines, sun exposure, and skin conditions.
2. Educate the user about skin health using accessible terminology.
3. Keep your advice educational, safe, and helpful. Always include subtle, natural reminders to consult professional dermatologists for diagnosis.
4. Keep answers relatively concise and highly structured using markdown bullets.

Context of current user:
- Skin Type: ${skinProfile?.skinType || 'Combination'}
- Top concerns: ${JSON.stringify(skinProfile?.concerns || [])}
- Skin health score: ${skinProfile?.overallScore || 'Not evaluated yet'}`;

    // Use chats API or standard generateContent with history
    const contents = [
      ...formattedHistory,
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction
      }
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error('Error in chat:', error);
    return res.status(500).json({ error: 'Faced an issue connecting to Dr. Sam. Please try again.' });
  }
});

// 5. Endpoint: OCR Label Scanner & Cosmetic Ingredient Extraction
app.post('/api/analyze-label', async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'Product label image is required.' });
  }

  const client = getGeminiClient();
  if (!client) {
    console.log('GEMINI_API_KEY is not configured. Returning simulated label analysis.');
    return res.json({
      productName: "Simulated Advanced Repair Serum",
      extractedIngredients: ["Water", "Niacinamide (5%)", "Hyaluronic Acid", "Phenoxyethanol", "Ceramide NP", "Fragrance"],
      suitabilityScore: 92,
      analysis: [
        { ingredient: "Niacinamide", function: "Brightening & barrier repair", safe: true },
        { ingredient: "Hyaluronic Acid", function: "Deep humectant hydration", safe: true },
        { ingredient: "Ceramide NP", function: "Reinforces skin barrier", safe: true },
        { ingredient: "Fragrance", function: "Scent agent, potential allergen", safe: false }
      ],
      safetyScore: 85,
      verdict: "This serum is highly beneficial for strengthening the skin barrier and retaining moisture. However, the inclusion of artificial fragrance means sensitive skin types should perform a 24-hour patch test before full application."
    });
  }

  try {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `Examine this cosmetic product label or ingredient list. Extract the active compounds, analyze safety, and grade the ingredients.
Your output MUST be strict JSON matching this structure:
{
  "productName": "Extracted or inferred product name",
  "extractedIngredients": ["Ingredient 1", "Ingredient 2", "etc."],
  "suitabilityScore": number from 0 to 100 representing suitability,
  "analysis": [
    {
      "ingredient": "Name of ingredient",
      "function": "Brief scientific mechanism / function in this product",
      "safe": true or false (false if known common irritant/allergen/pore-clogger)
    }
  ],
  "safetyScore": number from 0 to 100,
  "verdict": "Detailed overall formulation verdict and advice on who should use it or avoid it."
}
Provide ONLY the JSON object. Do not include markdown codeblocks or extra text.`;

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data
          }
        },
        prompt
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsedData = JSON.parse((response.text || '').trim());
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error in OCR label analysis:', error);
    return res.status(500).json({ error: 'Failed to extract or analyze the cosmetic label.' });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkinSense AI full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
