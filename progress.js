function renderProgressPage() {
  document.getElementById('progress-content').innerHTML = `
    <div class="notes-container">
      
      <!-- STATS SECTION -->
      <h2>📊 My Progress</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;
      gap:16px;margin-bottom:24px">
        <div class="notes-card" style="text-align:center">
          <div style="font-size:2rem;font-weight:800;
          color:#4f8ef7" id="stat-topics">0</div>
          <div style="color:var(--muted);font-size:0.8rem">
          Topics Studied</div>
        </div>
        <div class="notes-card" style="text-align:center">
          <div style="font-size:2rem;font-weight:800;
          color:#a78bfa" id="stat-sessions">0</div>
          <div style="color:var(--muted);font-size:0.8rem">
          Pomodoro Sessions</div>
        </div>
        <div class="notes-card" style="text-align:center">
          <div style="font-size:2rem;font-weight:800;
          color:#34d399" id="stat-streak">0</div>
          <div style="color:var(--muted);font-size:0.8rem">
          Day Streak 🔥</div>
        </div>
      </div>

      <!-- META COGNITION SECTION -->
      <div class="notes-card">
        <h3 style="color:var(--accent);margin-bottom:8px">
        🧠 Meta Cognition Analyzer</h3>
        <p style="color:var(--muted);font-size:0.85rem;
        margin-bottom:16px">
        Test how well you understand a topic. Answer 5 questions 
        and AI will analyze your understanding level.</p>
        
        <input type="text" id="meta-topic" 
        placeholder="Enter topic to analyze your understanding..." />
        <button onclick="startMetaCognition()" 
        class="btn-notes" style="margin-top:10px">
        🧠 Start Analysis</button>
        
        <div id="meta-questions" style="margin-top:16px"></div>
        <div id="meta-result"></div>
      </div>

    </div>
  `;
  loadStats();
}

function loadStats() {
  const topics = JSON.parse(
    localStorage.getItem('edumind_topics') || '[]');
  const sessions = localStorage.getItem('edumind_sessions') || 0;
  const streak = localStorage.getItem('edumind_streak') || 0;
  document.getElementById('stat-topics').textContent = topics.length;
  document.getElementById('stat-sessions').textContent = sessions;
  document.getElementById('stat-streak').textContent = streak;
}

let metaQuestions = [];
let metaAnswers = [];

async function startMetaCognition() {
  const topic = document.getElementById('meta-topic').value;
  if (!topic) { alert('Please enter a topic!'); return; }

  document.getElementById('meta-questions').innerHTML = 
    '<p style="color:#7b82a8">Generating questions...</p>';
  document.getElementById('meta-result').innerHTML = '';

  const prompt = 'Create 5 short questions to test understanding of: ' 
  + topic 
  + '. Return ONLY a valid JSON array like this: '
  + '[{"q":"Question 1?"},{"q":"Question 2?"}] '
  + 'No explanation, no markdown backticks, just JSON array.';

  const result = await callAI(prompt);

  try {
    const clean = result.replace(/```json|```/g, '').trim();
    metaQuestions = JSON.parse(clean);
    metaAnswers = [];
    renderMetaQuestions(topic);
  } catch(e) {
    document.getElementById('meta-questions').innerHTML = 
      '<p style="color:red">Error. Try again!</p>';
  }
}

function renderMetaQuestions(topic) {
  let html = `
    <div style="margin-top:16px">
      <p style="color:var(--muted);font-size:0.85rem;
      margin-bottom:16px">
      Answer each question in your own words:</p>`;
  
  metaQuestions.forEach((q, i) => {
    html += `
      <div class="notes-card" style="margin-bottom:12px">
        <p style="font-weight:600;margin-bottom:8px;color:var(--accent)">
        Q${i+1}: ${q.q}</p>
        <textarea id="meta-answer-${i}" 
        placeholder="Write your answer here..."
        style="min-height:80px;width:100%"></textarea>
      </div>`;
  });

  html += `
    <button onclick="analyzeMetaCognition('${topic}')" 
    class="btn-notes" style="background:#a78bfa;margin-top:10px">
    🔍 Analyze My Understanding</button>
    </div>`;
  
  document.getElementById('meta-questions').innerHTML = html;
}

async function analyzeMetaCognition(topic) {
  const answers = metaQuestions.map((q, i) => {
    const ans = document.getElementById('meta-answer-' + i).value;
    return 'Q: ' + q.q + ' A: ' + ans;
  }).join(' | ');

  document.getElementById('meta-result').innerHTML = 
    '<p style="color:#7b82a8">Analyzing your understanding...</p>';

  const prompt = 'A student answered these questions about ' + topic 
  + ': ' + answers 
  + '. Analyze their understanding and respond with: '
  + 'SCORE: (0-100) '
  + 'STRONG POINTS: what they understood well '
  + 'WEAK POINTS: what they got wrong or missed '
  + 'GAPS: important concepts they did not mention '
  + 'RECOMMENDATION: what to study next '
  + 'Be specific and encouraging.';

  const result = await callAI(prompt);

  const scoreMatch = result.match(/SCORE:\s*(\d+)/);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
  const color = score >= 80 ? '#34d399' 
    : score >= 60 ? '#4f8ef7' : '#f87171';

  document.getElementById('meta-result').innerHTML = `
    <div class="notes-card" style="margin-top:16px">
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:3rem;font-weight:800;color:${color}">
        ${score}/100</div>
        <div style="color:var(--muted);font-size:0.85rem">
        Understanding Score</div>
        <div style="
          background:var(--border);
          border-radius:99px;
          height:8px;
          width:200px;
          margin:12px auto">
          <div style="
            height:100%;
            border-radius:99px;
            background:${color};
            width:${score}%">
          </div>
        </div>
      </div>
      <div style="line-height:1.8;font-size:0.88rem">
        ${result.replace(/SCORE:\s*\d+/,'').replace(/\n/g,'<br>')}
      </div>
    </div>
  `;

  // Save to localStorage
  const topics = JSON.parse(
    localStorage.getItem('edumind_topics') || '[]');
  if (!topics.includes(topic)) {
    topics.push(topic);
    localStorage.setItem('edumind_topics', JSON.stringify(topics));
  }
  loadStats();
}