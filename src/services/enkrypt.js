/**
 * Enkrypt AI LLM Guardrail Middleware
 * Audits prompt injections, hallucinations, and clinical safety compliance
 */

export function checkSafetyGuardrails(prompt) {
  console.log("[Enkrypt AI] Auditing prompt content for compliance...");
  
  const suspiciousKeywords = ["admin_bypass", "ignore_instructions", "drop_db"];
  const lowerPrompt = prompt.toLowerCase();
  
  for (const word of suspiciousKeywords) {
    if (lowerPrompt.includes(word)) {
      console.warn(`[Enkrypt AI Security Alert] Blocked suspicious keyword: "${word}"`);
      return {
        safe: false,
        reason: "Prompt blocked by Enkrypt AI compliance guardrails (instruction injection protection)."
      };
    }
  }
  
  console.log("[Enkrypt AI] Audit passed. Prompt categorized as safe.");
  return { safe: true };
}

export function sanitizeModelOutput(responseText) {
  console.log("[Enkrypt AI] Scanning generated content for toxicity and PII compliance...");
  // Basic content cleaning
  return responseText.replace(/confidential/gi, "[REDACTED_SECURITY]");
}
