const { OpenAI } = require('openai');

const {
  matchInstitutionsToProblem
} = require('./institutionMatchingService');


// ============================================================
// HUGGING FACE / OPENAI CLIENT
// ============================================================

const client = new OpenAI({
  baseURL: 'https://router.huggingface.co/v1',
  apiKey: process.env.HF_TOKEN,

  // Prevent AI requests from hanging indefinitely
  timeout: 45000,

  // Only retry once
  maxRetries: 1
});


// ============================================================
// MODEL
// ============================================================

const MODEL =
  process.env.HF_MODEL ||
  'deepseek-ai/DeepSeek-R1:fastest';


// ============================================================
// ALLOWED VALUES
// ============================================================

const ALLOWED_CATEGORIES = [
  'Roads',
  'Water',
  'Electricity',
  'Sanitation',
  'Healthcare',
  'Education',
  'Transport',
  'Housing',
  'Environment',
  'Other'
];

const ALLOWED_PRIORITIES = [
  'Low',
  'Medium',
  'High',
  'Urgent'
];


// ============================================================
// NORMALIZE ARRAY
// ============================================================

const normalizeArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return [
    ...new Set(
      value
        .map((item) =>
          String(item || '').trim()
        )
        .filter(Boolean)
    )
  ];
};


// ============================================================
// CLEAN AI JSON RESPONSE
// ============================================================

const cleanJsonResponse = (content) => {
  if (!content) {
    throw new Error(
      'AI returned an empty response.'
    );
  }

  let text = String(content).trim();

  text = text
    .replace(/^```json/i, '')
    .replace(/^```/i, '')
    .replace(/```$/i, '')
    .trim();

  const firstBrace =
    text.indexOf('{');

  const lastBrace =
    text.lastIndexOf('}');

  if (
    firstBrace !== -1 &&
    lastBrace !== -1 &&
    lastBrace > firstBrace
  ) {
    text = text.slice(
      firstBrace,
      lastBrace + 1
    );
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error(
      '❌ Failed to parse AI JSON:',
      text
    );

    throw new Error(
      'AI returned invalid JSON.'
    );
  }
};


// ============================================================
// NORMALIZE ANALYSIS
// ============================================================

const normalizeAnalysis = (raw) => {

  let category =
    String(
      raw.category || 'Other'
    ).trim();

  const matchedCategory =
    ALLOWED_CATEGORIES.find(
      (item) =>
        item.toLowerCase() ===
        category.toLowerCase()
    );

  category =
    matchedCategory || 'Other';


  let priority =
    String(
      raw.priority || 'Medium'
    ).trim();

  const matchedPriority =
    ALLOWED_PRIORITIES.find(
      (item) =>
        item.toLowerCase() ===
        priority.toLowerCase()
    );

  priority =
    matchedPriority || 'Medium';


  let confidence =
    Number(raw.confidence);

  if (Number.isNaN(confidence)) {
    confidence = 0.5;
  }

  confidence =
    Math.max(
      0,
      Math.min(1, confidence)
    );


  return {

    category,

    priority,

    confidence,

    summary:
      String(
        raw.summary || ''
      ).trim(),

    departments:
      normalizeArray(
        raw.departments
      ),

    disciplines:
      normalizeArray(
        raw.disciplines
      ),

    technologies:
      normalizeArray(
        raw.technologies
      ),

    keywords:
      normalizeArray(
        raw.keywords
      ),

    suggestedActions:
      normalizeArray(
        raw.suggestedActions
      ),

    duplicateCandidates:
      Array.isArray(
        raw.duplicateCandidates
      )
        ? raw.duplicateCandidates
        : []
  };
};


// ============================================================
// ANALYZE PROBLEM
// ============================================================

const analyzeProblem = async ({
  title,
  description,
  location,
  existingCategory,
  existingPriority
}) => {

  // ----------------------------------------------------------
  // Check token
  // ----------------------------------------------------------

  if (!process.env.HF_TOKEN) {
    throw new Error(
      'HF_TOKEN is not configured.'
    );
  }


  console.log(
    '🤖 Starting AI analysis...'
  );

  console.log(
    '🤖 Model:',
    MODEL
  );


  // ----------------------------------------------------------
  // Convert location safely to text
  // ----------------------------------------------------------

  let locationText = '';

  if (typeof location === 'string') {

    locationText = location;

  } else if (location) {

    locationText =
      location.address ||
      location.formattedAddress ||
      JSON.stringify(location);

  }


  // ==========================================================
  // PROMPT
  // ==========================================================

  const prompt = `
You are the AI analysis engine for JanSethu,
a citizen problem reporting and collaboration platform.

Analyze the citizen-reported problem below.

IMPORTANT RULES:

1. Classify the problem into exactly one category:
${ALLOWED_CATEGORIES.join(', ')}

2. Classify priority into exactly one:
${ALLOWED_PRIORITIES.join(', ')}

3. Extract useful departments.

4. Extract academic and technical disciplines.

5. Extract technologies, skills or technical areas.

6. Extract important keywords.

7. Give practical suggested actions.

8. Give a concise summary.

9. Estimate confidence between 0 and 1.

10. Do NOT invent universities, organizations,
people, researchers or students.

11. Do NOT claim that any student has accepted
or been assigned to the problem.

12. Human decision makers retain control.

Return ONLY valid JSON.

Required JSON format:

{
  "category": "Roads",
  "priority": "High",
  "confidence": 0.92,
  "summary": "Short explanation",
  "departments": [
    "Civil Engineering"
  ],
  "disciplines": [
    "Transportation Engineering"
  ],
  "technologies": [
    "GIS",
    "Computer Vision"
  ],
  "keywords": [
    "pothole",
    "road damage"
  ],
  "suggestedActions": [
    "Inspect the affected road",
    "Prioritize repair"
  ],
  "duplicateCandidates": []
}

Citizen problem:

Title:
${title || ''}

Description:
${description || ''}

Location:
${locationText}

Existing category:
${existingCategory || ''}

Existing priority:
${existingPriority || ''}
`;


  // ==========================================================
  // CALL HUGGING FACE
  // ==========================================================

  let completion;

  try {

    console.log(
      '📡 Sending request to Hugging Face...'
    );

    completion =
      await client.chat.completions.create({

        model: MODEL,

        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],

        temperature: 0.2,

        max_tokens: 1500
      });

    console.log(
      '✅ Hugging Face response received.'
    );

  } catch (error) {

    console.error(
      '❌ Hugging Face AI request failed:',
      error.message
    );

    if (
      error?.status
    ) {
      console.error(
        '❌ AI HTTP status:',
        error.status
      );
    }

    throw error;
  }


  // ==========================================================
  // EXTRACT RESPONSE
  // ==========================================================

  const content =
    completion
      ?.choices?.[0]
      ?.message?.content;


  if (!content) {

    throw new Error(
      'AI returned no message content.'
    );
  }


  console.log(
    '🧠 AI response content received.'
  );


  // ==========================================================
  // PARSE JSON
  // ==========================================================

  const raw =
    cleanJsonResponse(content);


  const analysis =
    normalizeAnalysis(raw);


  console.log(
    '✅ AI analysis normalized.'
  );

  console.log(
    '🏷️ Category:',
    analysis.category
  );

  console.log(
    '🚨 Priority:',
    analysis.priority
  );

  console.log(
    '🎯 Confidence:',
    analysis.confidence
  );


  // ==========================================================
  // INSTITUTION MATCHING
  // ==========================================================
  //
  // IMPORTANT:
  // Institution matching is optional.
  //
  // If it fails or takes too long,
  // the AI analysis itself still succeeds.
  // ==========================================================

  let institutionMatches = [];


  try {

    console.log(
      '🏫 Finding matching institutions...'
    );


    institutionMatches =
      await Promise.race([

        matchInstitutionsToProblem(
          analysis,
          location
        ),

        new Promise(
          (_, reject) =>
            setTimeout(
              () =>
                reject(
                  new Error(
                    'Institution matching timed out.'
                  )
                ),
              20000
            )
        )

      ]);


    if (
      !Array.isArray(
        institutionMatches
      )
    ) {
      institutionMatches = [];
    }


    console.log(
      '🏫 Institution matching completed:',
      institutionMatches.length
    );


  } catch (error) {

    console.error(
      '⚠️ Institution matching failed:',
      error.message
    );

    // Do NOT fail the entire AI analysis.
    institutionMatches = [];
  }


  // ==========================================================
  // FINAL RESULT
  // ==========================================================

  return {

    ...analysis,

    institutionMatches,

    processedAt:
      new Date(),

    model:
      MODEL,

    status:
      'Completed'
  };
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  analyzeProblem
};