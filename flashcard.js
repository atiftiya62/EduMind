function renderFlashcardPage() {
  document.getElementById("flashcard-content").innerHTML = `
    <div class="notes-container">
      <h2>🃏 Flashcard Generator</h2>
      <input type="text" id="flashcard-topic" 
      placeholder="Enter topic for flashcards..." />
      <select id="flashcard-level">
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
      <button onclick="generateFlashcards()" 
      class="btn-notes">Generate Flashcards</button>
      <div id="flashcard-output"></div>
    </div>
  `;
}

let currentCard = 0;
let flashcards = [];
let showingAnswer = false;

async function generateFlashcards() {
  const topic = document.getElementById("flashcard-topic").value;
  const level = document.getElementById("flashcard-level").value;
  if (!topic) {
    alert("Please enter a topic!");
    return;
  }

  document.getElementById("flashcard-output").innerHTML =
    '<p style="color:#7b82a8">Generating flashcards...</p>';

  const prompt =
    "Create 5 flashcards for the topic: " +
    topic +
    " for " +
    level +
    " level student. " +
    "Return ONLY a valid JSON array like this: " +
    '[{"question":"What is...?","answer":"It is..."}] ' +
    "No explanation, no markdown backticks, just the JSON array.";

  const result = await callAI(prompt);

  try {
    const clean = result.replace(/```json|```/g, "").trim();
    flashcards = JSON.parse(clean);
    currentCard = 0;
    showingAnswer = false;
    renderCard();
  } catch (e) {
    document.getElementById("flashcard-output").innerHTML =
      '<p style="color:red">Error generating flashcards. Try again!</p>';
  }
}

function renderCard() {
  if (!flashcards.length) return;
  const card = flashcards[currentCard];
  showingAnswer = false;

  document.getElementById("flashcard-output").innerHTML = `
    <div class="notes-card" style="text-align:center">
      <div style="color:var(--muted);font-size:0.8rem;margin-bottom:12px">
        Card ${currentCard + 1} of ${flashcards.length}
      </div>
      <div style="
        background:var(--surface2);
        border:1px solid var(--border);
        border-radius:16px;
        padding:40px 24px;
        margin-bottom:20px;
        min-height:150px;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:1.1rem;
        font-weight:500;
        cursor:pointer"
        onclick="flipCard()"
        id="card-face">
        <div>
          <div style="color:var(--muted);font-size:0.75rem;
          margin-bottom:12px;letter-spacing:1px">QUESTION</div>
          ${card.question}
        </div>
      </div>
      <div class="flashcard-actions">
        <button onclick="flipCard()" class="btn-notes" style="background:#a78bfa">
          👁️ Show Answer
        </button>
        <button onclick="nextCard()" class="btn-notes" style="background:#34d399">
          Next ➡️
        </button>
        <button onclick="prevCard()" class="btn-notes" style="background:#fb923c">
          ⬅️ Prev
        </button>
      </div>

    </div>
  `;
}

function flipCard() {
  if (!flashcards.length) return;
  const card = flashcards[currentCard];
  showingAnswer = !showingAnswer;
  const face = document.getElementById("card-face");
  if (showingAnswer) {
    face.innerHTML = `
      <div>
        <div style="color:#34d399;font-size:0.75rem;
        margin-bottom:12px;letter-spacing:1px">ANSWER</div>
        ${card.answer}
      </div>`;
    face.style.borderColor = "#34d399";
    face.style.background = "rgba(52,211,153,0.08)";
  } else {
    face.innerHTML = `
      <div>
        <div style="color:var(--muted);font-size:0.75rem;
        margin-bottom:12px;letter-spacing:1px">QUESTION</div>
        ${card.question}
      </div>`;
    face.style.borderColor = "var(--border)";
    face.style.background = "var(--surface2)";
  }
}

function nextCard() {
  if (currentCard < flashcards.length - 1) {
    currentCard++;
    renderCard();
  } else {
    document.getElementById("flashcard-output").innerHTML += `
      <div style="text-align:center;margin-top:16px;color:#fbbf24">
        🎉 You completed all flashcards!
      </div>`;
  }
}

function prevCard() {
  if (currentCard > 0) {
    currentCard--;
    renderCard();
  }
}
