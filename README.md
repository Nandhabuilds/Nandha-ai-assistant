# Nandha AI Assistant

This is the backend for the AI chat assistant on my portfolio site ([nandhabuilds.github.io](https://nandhabuilds.github.io)). It's a small Cloudflare Worker that sits between my portfolio and an AI model, so visitors can ask questions like "what has Nandha built?" or "what's his experience with Azure?" and get a real answer.

## Why this exists

My portfolio is a static site hosted on GitHub Pages, which means it can't run any server-side code or safely store an API key. This Worker solves that — it holds the AI API key securely, adds context about my background and projects, forwards the visitor's message to the AI model, and sends back a reply. The portfolio site just calls this Worker's URL and displays whatever comes back.

## How it works

1. Visitor types a message in the chat widget on my portfolio
2. The site sends that message to this Worker
3. The Worker adds a system prompt describing who I am, what I do at TCS, and what I'm building (GitOps Mini Lab, certs, etc.)
4. It forwards everything to the AI model
5. The AI's reply gets sent straight back to the widget

## Tech used

- **Cloudflare Workers** — free, serverless backend, no server to maintain
- **Groq API** — free-tier AI model (switched over from Gemini after running into a billing requirement I didn't want to deal with)

## Running it yourself

If you want to fork this and point it at your own portfolio:

1. Clone this repo
2. Run `npm install`
3. Get a free API key from [console.groq.com](https://console.groq.com)
4. Store it as a secret:
   ```
   wrangler secret put GROQ_API_KEY
   ```
5. Update the `systemPrompt` in `src/index.js` with your own details
6. Deploy:
   ```
   wrangler deploy
   ```

## Status

Live and working. Currently answers questions about my background, TCS role, and ongoing projects. Next up: adding voice input/output and a small animated avatar to the chat widget on the portfolio side.

## Related

- Portfolio site: [github.com/Nandhabuilds/Nandhabuilds.github.io](https://github.com/Nandhabuilds/Nandhabuilds.github.io)


## Get started

1. Sign up for [Cloudflare Workers](https://workers.dev). The free tier is more than enough for most use cases.
2. Clone this project and install dependencies with `npm install`
3. Run `wrangler login` to login to your Cloudflare account in wrangler
4. Run `wrangler deploy` to publish the API to Cloudflare Workers

## Project structure

1. Your main router is defined in `src/index.ts`.
2. Each endpoint has its own file in `src/endpoints/`.
3. For more information read the [chanfana documentation](https://chanfana.pages.dev/) and [Hono documentation](https://hono.dev/docs).

## Development

1. Run `wrangler dev` to start a local instance of the API.
2. Open `http://localhost:8787/` in your browser to see the Swagger interface where you can try the endpoints.
3. Changes made in the `src/` folder will automatically trigger the server to reload, you only need to refresh the Swagger interface.
