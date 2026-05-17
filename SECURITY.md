# Security

## API Keys

This project should not require API keys for normal demo use.

Do not commit:

- OpenAI, Anthropic, Gemini, OpenRouter, or other provider keys.
- `.env` or `.env.local` files.
- Vercel project metadata.
- Private billing, usage, or customer data.

## External Requests

The app requests OpenRouter's public model metadata endpoint. It does not call paid generation APIs.

If generation features are added later, use a server-side proxy, rate limits, usage caps, and abuse controls. Never expose provider keys in client-side code.

## Reporting Issues

Open a GitHub issue with reproduction steps and affected files. Do not include secrets in the issue body or screenshots.
