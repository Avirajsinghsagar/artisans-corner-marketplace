const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Product = require("../models/product");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

async function askAI(prompt) {
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + OPENROUTER_API_KEY,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Artisans Corner",
    },
    body: JSON.stringify({
      model: "openrouter/auto", // ✅ OpenRouter picks best available free model automatically
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    }),
  });

  const data = await response.json();
  console.log("OpenRouter response:", JSON.stringify(data, null, 2));

  if (data.error) {
    throw new Error(data.error.message || "OpenRouter error");
  }

  if (!data.choices || !data.choices[0]) {
    throw new Error("No choices in response");
  }

  return data.choices[0].message.content.trim();
}

router.post("/generate-description", protect, async (req, res) => {
  try {
    const { title, category, price } = req.body;
    if (!title || !category) {
      return res.status(400).json({ message: "Title and category required" });
    }

    const prompt = `Write a 2-3 sentence product description for a handmade Indian marketplace.
Product: ${title}, Category: ${category}, Price: Rs.${price || "not set"}.
Sound warm and highlight craftsmanship. Return ONLY the description text, nothing else.`;

    const description = await askAI(prompt);
    res.json({ description });
  } catch (error) {
    console.error("AI description error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

router.post("/recommend", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || query.trim().length < 3) {
      return res.status(400).json({ message: "Please describe what you need" });
    }

    const products = await Product.find({}).limit(20).select("title category price");
    const productList = products
      .map((p, i) => `${i + 1}. ${p.title} (${p.category}) - Rs.${p.price}`)
      .join("\n");

    const prompt = `You are a shopping assistant for an Indian handmade marketplace.
Buyer wants: "${query}"
Products available:
${productList}
Recommend 2-3 best matches with one sentence each. Under 80 words total.`;

    const recommendation = await askAI(prompt);
    res.json({ recommendation });
  } catch (error) {
    console.error("AI recommend error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;