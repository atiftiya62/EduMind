const GROQ_API_KEY = "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

async function callAI(prompt) {
  try {
    const response = await fetch("https://corsproxy.io/?url=" + GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GROQ_API_KEY,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: String(prompt) }],
        temperature: 1,
        max_tokens: 1024,
      }),
    });
    if (!response.ok) {
      const err = await response.json();
      return "Error: " + (err.error?.message || "Unknown error");
    }
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    return "Error: Please try again.";
  }
}

function showPage(id) {
  document.querySelectorAll(".page").forEach((p) => {
    p.style.display = "none";
  });
  document.querySelectorAll(".nav-link").forEach((n) => {
    n.classList.remove("active");
  });
  const target = document.getElementById(id);
  if (target) target.style.display = "block";
}

window.addEventListener("load", () => {
  showPage("home");
  renderLearnPage();
  renderNotesPage();
  renderDiagramPage();
  renderFlashcardPage();
  renderPomodoroPage();
  renderProgressPage();
  renderQuizPage();
});
