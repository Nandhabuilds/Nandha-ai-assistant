export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders() });
    }

    try {
      const { message } = await request.json();

      if (!message) {
        return new Response(JSON.stringify({ error: "No message provided" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders() },
        });
      }

      const systemPrompt = `You are a friendly AI assistant on Nandhakumar S's portfolio website.
Nandha is an Assistant Systems Engineer at TCS Chennai, working on Azure Stack HCI, Hyper-V clusters,
VMware-to-Hyper-V migration, and Azure Arc onboarding. He is studying for AZ-900 and AZ-104,
building a self-hosted CI/CD "GitOps Mini Lab" on GitHub Actions, and job-hunting for
DevOps/Cloud Engineer roles at product companies. Answer questions about his background and
projects helpfully and accurately. If asked something unrelated to him, just chat normally and helpfully.
Keep replies concise and friendly.`;

      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
        }),
      });

      const data = await groqResponse.json();
      const reply = data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response right now.";

      return new Response(JSON.stringify({ reply }), {
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Something went wrong", details: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }
  },
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}