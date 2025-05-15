import { genkit } from "genkit/beta";
import { defineCodeFormat } from "./code-format.js";
import { gemini20Flash, googleAI } from "@genkit-ai/googleai";

export const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash,
});

defineCodeFormat(ai);

export { z } from "genkit/beta";
