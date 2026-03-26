



const OpenAI = require("openai");
const { searchKnowledge } = require("../utils/searchKnowledge");
require("dotenv").config();

/**
 * Initialize HuggingFace Router Client
 */
const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HUGGINGFACE_API_KEY,
});

/**
 * Detect if the user is asking about how to use the platform
 */
function isPlatformQuestion(message) {
  const msg = message.toLowerCase();

  const triggers = [
    "register",
    "sign up",
    "sign in",
    "login",
    "how to use",
    "how do i",
    "submit complaint",
    "file complaint",
    "complete profile",
    "verify",
    "anonymous",
    "drop and go"
  ];

  return triggers.some(keyword => msg.includes(keyword));
}

/**
 * FairSay Platform User Guide
 * (Only injected when relevant)
 */
function getPlatformGuide() {
  return `
FAIRSAY PLATFORM GUIDE

Account Registration:
1. Click Sign Up
2. Enter your name, email, and password
3. Submit the registration form
4. A verification email will be sent to your email address
5. Open your email inbox
6. Click the verification link inside the email
7. Email verification can ONLY be completed through the email link

Login:
- Enter your email and password

Profile Completion:
- Provide job role and department
- Enter company name
- Optional: phone number and work location

Employee Verification:
- Submit self-declaration of employment
- Upload proof (offer letter, staff ID, official email, or payslip)

Complaint Submission:
1. Select complaint type
2. Provide detailed description
3. Upload evidence
4. Choose:
   - Identified submission
   - Anonymous submission (Drop-and-Go)

Anonymous (Drop-and-Go):
- Identity hidden
- Tracking ID provided
`;
}

/**
 * Main AI Controller
 */
const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Retrieve legal knowledge (RAG)
    const relevantKnowledge = searchKnowledge(message);

    // Determine if platform guide should be injected
    const platformContext = isPlatformQuestion(message)
      ? getPlatformGuide()
      : "";

    // Construct strict system prompt
    // const systemPrompt = `
    //   You are FairSay AI.

    //   FairSay is a Nigerian workplace complaint support platform
    //   that provides labour law guidance and structured complaint escalation.

    //   STRICT RULES:
    //   - Only describe features listed in PLATFORM GUIDE.
    //   - Do NOT invent features.
    //   - Do NOT create URLs.
    //   - Do NOT mention technical system details.
    //   - Keep responses under 200 words.
    //   - Be professional and direct.
    //   - If legal question: base answer on LEGAL KNOWLEDGE.
    //   - If platform usage question: base answer only on PLATFORM GUIDE.

    //   LEGAL KNOWLEDGE:
    //   ${relevantKnowledge}

    //   PLATFORM GUIDE:
    //   ${platformContext}
    // `;

    const systemPrompt = `
      You are FairSay AI.

      FairSay is a Nigerian workplace complaint support platform
      that provides labour law guidance and structured complaint escalation.

      STRICT RULES:
      - Only describe features listed in PLATFORM GUIDE.
      - Do NOT invent features.
      - Do NOT create URLs.
      - Do NOT mention technical system details.
      - Keep responses under 200 words.
      - Be professional and direct.
      - Always prioritize LEGAL KNOWLEDGE entries over general knowledge.
      - Only answer based on Nigerian laws, company policies, or documents provided.
      - For workplace issues (e.g., harassment), ALWAYS advise users to report internally first.
      - Only suggest FairSay complaint submission AFTER mentioning internal reporting.

      LEGAL KNOWLEDGE:
      ${relevantKnowledge}

      PLATFORM GUIDE:
      ${platformContext}
      `;

    // Call LLM
    const response = await client.chat.completions.create({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.4, // lower = less hallucination
    });

    return res.json({
      reply: response.choices[0].message.content.trim(),
    });

  } catch (error) {
    console.error("AI Error:", error.message);

    return res.status(500).json({
      error: "AI request failed",
    });
  }
};

module.exports = { chatWithAI };