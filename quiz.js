function renderQuizPage() {
  document.getElementById('quiz-content').innerHTML = `
    <div class="notes-container">
      <h2>✅ Active Recall Quiz</h2>
      <p style="color:var(--muted);font-size:0.85rem;margin-bottom:16px">
      Test your knowledge with AI generated questions!</p>
      
      <input type="text" id="quiz-topic" 
      placeholder="Enter topic for quiz..." />
      
      <select id="quiz-type" style="margin-top:10px">
        <option value="mcq">Multiple Choice</option>
        <option value="truefalse">True / False</option>
        <option value="fill">Fill in the Blank</option>
      </select>

      <select id="quiz-level" style="margin-top:10px">
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <button onclick="generateQuiz()" 
      class="btn-notes" style="margin-top:10px">
      🎯 Start Quiz</button>
      
      <div id="quiz-output" style="margin-top:16px"></div>
    </div>
  `;
}

let quizData = [];
let currentQuestion = 0;
let score = 0;
let answered = false;

async function generateQuiz() {
  const topic = document.getElementById('quiz-topic').value;
  const type = document.getElementById('quiz-type').value;
  const level = document.getElementById('quiz-level').value;
  if (!topic) { alert('Please enter a topic!'); return; }

  document.getElementById('quiz-output').innerHTML = 
    '<p style="color:#7b82a8">Generating quiz questions...</p>';

  let prompt = '';

  if (type === 'mcq') {
    prompt = 'Create 5 multiple choice questions about ' + topic 
    + ' for ' + level + ' level. '
    + 'Return ONLY a valid JSON array like this: '
    + '[{"q":"Question?","options":["A) option1","B) option2",'
    + '"C) option3","D) option4"],"answer":"A","explanation":"reason"}] '
    + 'No explanation outside JSON, no markdown backticks.';
  } else if (type === 'truefalse') {
    prompt = 'Create 5 true or false questions about ' + topic 
    + ' for ' + level + ' level. '
    + 'Return ONLY a valid JSON array like this: '
    + '[{"q":"Statement?","options":["True","False"],'
    + '"answer":"True","explanation":"reason"}] '
    + 'No explanation outside JSON, no markdown backticks.';
  } else {
    prompt = 'Create 5 fill in the blank questions about ' + topic 
    + ' for ' + level + ' level. '
    + 'Return ONLY a valid JSON array like this: '
    + '[{"q":"The ___ is the powerhouse of the cell.",'
    + '"options":["mitochondria","nucleus","ribosome","cell wall"],'
    + '"answer":"mitochondria","explanation":"reason"}] '
    + 'No explanation outside JSON, no markdown backticks.';
  }

  const result = await callAI(prompt);

  try {
    const clean = result.replace(/```json|```/g, '').trim();
    quizData = JSON.parse(clean);
    currentQuestion = 0;
    score = 0;
    answered = false;
    renderQuestion();
  } catch(e) {
    document.getElementById('quiz-output').innerHTML = 
      '<p style="color:red">Error generating quiz. Try again!</p>';
  }
}

function renderQuestion() {
  if (currentQuestion >= quizData.length) {
    showFinalScore();
    return;
  }

  const q = quizData[currentQuestion];
  const letters = ['A','B','C','D'];
  answered = false;

  let optionsHtml = q.options.map((opt, i) => `
    <div onclick="selectAnswer('${opt}', this)" 
    style="
      display:flex;align-items:center;gap:12px;
      padding:13px 16px;
      background:var(--surface2);
      border:1px solid var(--border);
      border-radius:10px;
      margin-bottom:10px;
      cursor:pointer;
      transition:all 0.16s;
      font-size:0.9rem"
    onmouseover="this.style.borderColor='#4f8ef7'"
    onmouseout="if(!this.classList.contains('correct') && 
    !this.classList.contains('wrong')) 
    this.style.borderColor='var(--border)'"
    data-answer="${opt}">
      <div style="
        width:28px;height:28px;
        border-radius:8px;
        background:var(--border);
        display:flex;align-items:center;
        justify-content:center;
        font-size:0.78rem;font-weight:700;
        flex-shrink:0">
        ${letters[i] || i+1}
      </div>
      ${opt}
    </div>
  `).join('');

  document.getElementById('quiz-output').innerHTML = `
    <div class="notes-card">
      <div style="display:flex;justify-content:space-between;
      margin-bottom:14px">
        <span style="
          background:rgba(79,142,247,0.12);
          color:#4f8ef7;
          padding:3px 10px;
          border-radius:20px;
          font-size:0.75rem;
          font-weight:600">
          Question ${currentQuestion+1} / ${quizData.length}
        </span>
        <span style="color:#fbbf24;font-size:0.85rem">
          Score: ${score}/${currentQuestion}
        </span>
      </div>
      <p style="font-size:1rem;font-weight:500;
      margin-bottom:18px">${q.q}</p>
      ${optionsHtml}
      <div id="quiz-explanation" style="margin-top:12px"></div>
    </div>
  `;
}

function selectAnswer(val, el) {
  if (answered) return;
  answered = true;

  const q = quizData[currentQuestion];
  const correct = val.startsWith(q.answer) || val === q.answer;

  document.querySelectorAll('[data-answer]').forEach(opt => {
    opt.style.pointerEvents = 'none';
    if (opt.dataset.answer.startsWith(q.answer) || 
    opt.dataset.answer === q.answer) {
      opt.style.borderColor = '#34d399';
      opt.style.background = 'rgba(52,211,153,0.08)';
      opt.style.color = '#34d399';
    }
  });

  if (!correct) {
    el.style.borderColor = '#f87171';
    el.style.background = 'rgba(248,113,113,0.08)';
    el.style.color = '#f87171';
  } else {
    score++;
  }

  if (q.explanation) {
    document.getElementById('quiz-explanation').innerHTML = `
      <div style="
        background:rgba(79,142,247,0.08);
        border:1px solid rgba(79,142,247,0.2);
        border-radius:10px;
        padding:12px 16px;
        font-size:0.85rem;
        color:#93c5fd">
        💡 ${q.explanation}
      </div>`;
  }

  setTimeout(() => {
    currentQuestion++;
    renderQuestion();
  }, 2000);
}

function showFinalScore() {
  const pct = Math.round(score / quizData.length * 100);
  const color = pct >= 80 ? '#34d399' 
    : pct >= 60 ? '#4f8ef7' : '#f87171';
  const msg = pct >= 80 ? '🌟 Excellent! You really know this topic!' 
    : pct >= 60 ? '👍 Good effort! Review the ones you missed.'
    : '📖 Keep studying! Try again after reviewing.';

  // Save quiz to localStorage
  const sessions = parseInt(
    localStorage.getItem('edumind_sessions') || 0) + 1;
  localStorage.setItem('edumind_sessions', sessions);

  document.getElementById('quiz-output').innerHTML = `
    <div class="notes-card" style="text-align:center">
      <div style="font-size:3rem;font-weight:800;color:${color}">
      ${score}/${quizData.length}</div>
      <div style="color:var(--muted);margin-top:6px">${msg}</div>
      <div style="
        background:var(--border);
        border-radius:99px;
        height:8px;
        width:200px;
        margin:16px auto">
        <div style="
          height:100%;
          border-radius:99px;
          background:${color};
          width:${pct}%">
        </div>
      </div>
      <button onclick="generateQuiz()" 
      class="btn-notes" style="margin-top:16px">
      🔄 Try Again</button>
    </div>
  `;
}
