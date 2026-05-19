"""
Gemini AI Client — Core LLM integration for all agents.
Migrated to google-genai SDK. Supports Flash (speed) and Pro (reasoning).
Structured JSON output, multimodal document analysis, retry with backoff.
"""
import json
import time
import logging
import traceback
from google import genai
from google.genai import types

logger = logging.getLogger(__name__)


class GeminiClient:
    """Centralized Gemini client with structured output, retry, and token accounting."""

    def __init__(self, api_key: str):
        self.client = genai.Client(api_key=api_key)
        self.model_flash = "gemini-2.5-flash"
        self.model_pro = "gemini-2.5-flash"
        self.total_tokens = 0
        self.total_calls = 0
        logger.info("GeminiClient initialized (google-genai SDK)")

    def _get_model(self, model_type: str) -> str:
        return self.model_flash if model_type == "flash" else self.model_pro

    async def generate(self, prompt: str, model_type: str = "flash", retries: int = 3,
                       temperature: float = 0.7, max_tokens: int = 8192) -> dict:
        """
        Generate structured JSON response with retry logic.
        Returns parsed dict or {"error": "..."} on failure.
        """
        model = self._get_model(model_type)
        last_error = None

        for attempt in range(retries):
            try:
                response = self.client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=temperature,
                        max_output_tokens=max_tokens,
                    )
                )

                text = response.text.strip()
                # Strip markdown fences if present
                text = self._strip_fences(text)
                result = json.loads(text)

                # Track usage
                usage = getattr(response, 'usage_metadata', None)
                tokens = usage.total_token_count if usage else 500
                self.total_tokens += tokens
                self.total_calls += 1

                logger.info(f"Gemini {model_type} | tokens={tokens} | attempt={attempt+1}")
                return result

            except json.JSONDecodeError as e:
                last_error = e
                logger.warning(f"JSON parse failed (attempt {attempt+1}): {str(e)[:100]}")
                time.sleep(2 ** attempt)
            except Exception as e:
                last_error = e
                logger.error(f"Gemini call failed (attempt {attempt+1}): {str(e)[:200]}")
                time.sleep(2 ** attempt)

        return {"error": str(last_error), "raw": "Generation failed after retries"}

    async def generate_with_reasoning(self, prompt: str, model_type: str = "pro",
                                       temperature: float = 0.5) -> dict:
        """
        Generate with extended thinking enabled (Pro model).
        Returns {"result": {...}, "reasoning_trace": "...", "tokens": N}
        """
        model = self._get_model(model_type)
        try:
            response = self.client.models.generate_content(
                model=model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=temperature,
                    max_output_tokens=16384,
                    thinking_config=types.ThinkingConfig(thinking_budget=4096),
                )
            )

            # Extract reasoning trace from thinking parts
            reasoning = ""
            result_text = ""
            for part in response.candidates[0].content.parts:
                if hasattr(part, 'thought') and part.thought:
                    reasoning += part.text + "\n"
                else:
                    result_text += part.text

            result_text = self._strip_fences(result_text.strip())
            result = json.loads(result_text) if result_text else {}

            usage = getattr(response, 'usage_metadata', None)
            tokens = usage.total_token_count if usage else 1000
            self.total_tokens += tokens
            self.total_calls += 1

            logger.info(f"Gemini reasoning | tokens={tokens} | reasoning_len={len(reasoning)}")
            return {
                "result": result,
                "reasoning_trace": reasoning[:2000] if reasoning else "Direct inference",
                "tokens": tokens,
            }

        except Exception as e:
            logger.error(f"Reasoning generation failed: {str(e)[:200]}")
            # Fallback to standard generation
            result = await self.generate(prompt, model_type)
            return {"result": result, "reasoning_trace": "Fallback (no thinking)", "tokens": 500}

    async def generate_text(self, prompt: str, model_type: str = "flash") -> str:
        """Generate plain text response (non-JSON)."""
        model = self._get_model(model_type)
        try:
            response = self.client.models.generate_content(
                model=model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.7,
                    max_output_tokens=8192,
                )
            )
            self.total_calls += 1
            return response.text.strip()
        except Exception as e:
            return f"Error: {str(e)}"

    async def analyze_document(self, prompt: str, file_bytes: bytes, mime_type: str) -> dict:
        """
        Multimodal document analysis — feeds PDF/image bytes + prompt to Gemini Pro.
        Used for contract analysis, invoice processing.
        """
        try:
            response = self.client.models.generate_content(
                model=self.model_pro,
                contents=[
                    types.Part.from_bytes(data=file_bytes, mime_type=mime_type),
                    prompt,
                ],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.3,
                    max_output_tokens=16384,
                )
            )

            text = self._strip_fences(response.text.strip())
            result = json.loads(text)

            usage = getattr(response, 'usage_metadata', None)
            tokens = usage.total_token_count if usage else 2000
            self.total_tokens += tokens
            self.total_calls += 1

            logger.info(f"Gemini multimodal | tokens={tokens}")
            return result

        except Exception as e:
            logger.error(f"Multimodal analysis failed: {str(e)}")
            return {"error": str(e), "traceback": traceback.format_exc()}

    def get_usage_stats(self) -> dict:
        """Return cumulative token/call stats for monitoring."""
        return {
            "total_tokens": self.total_tokens,
            "total_calls": self.total_calls,
            "estimated_cost_usd": round(self.total_tokens * 0.000001, 4),
        }

    @staticmethod
    def _strip_fences(text: str) -> str:
        """Remove markdown code fences from LLM output."""
        if text.startswith("```"):
            text = text.split("\n", 1)[1] if "\n" in text else text[3:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()
        return text
