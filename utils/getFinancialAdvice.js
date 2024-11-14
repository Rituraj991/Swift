// utils/getFinancialAdvice.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  dangerouslyAllowBrowser: true, // Caution: secure API key only on server-side
});

const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  console.log(`Budget: ${totalBudget}, Income: ${totalIncome}, Spend: ${totalSpend}`);

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 3000; // 3 seconds delay

  try {
    const userPrompt = `
      Based on the following financial data:
      - Total Budget: ${totalBudget} USD 
      - Expenses: ${totalSpend} USD 
      - Incomes: ${totalIncome} USD
      Provide detailed financial advice in 2 sentences to help the user manage their finances more effectively.
    `;

    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        // Directly call generateText on the genAI client
        const response = await genAI.generateText({
          prompt: userPrompt,
          model: "gemini-1.5-pro", // Model name or ID
          maxOutputTokens: 200,
        });

        const advice = response.text || "No advice available.";
        console.log(advice);
        return advice;
      } catch (error) {
        if (error.response?.status === 429) {
          retries++;
          console.warn(`Rate limit exceeded. Retrying... (${retries}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        } else {
          console.error("Error fetching financial advice:", error);
          throw error; // Rethrow non-rate-limit errors
        }
      }
    }

    return "Sorry, we couldn't fetch the financial advice at this moment due to rate limiting. Please try again later.";
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
  }
};

export default getFinancialAdvice;
