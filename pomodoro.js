function renderPomodoroPage() {
  document.getElementById('pomodoro-content').innerHTML = `
    <div class="notes-container">
      <h2>⏱️ Pomodoro Focus Timer</h2>
      
      <div style="text-align:center;margin:20px 0">
        <div id="pomo-circle" style="
          width:200px;height:200px;
          border-radius:50%;
          background:conic-gradient(#4f8ef7 0%, #232840 0%);
          display:flex;align-items:center;
          justify-content:center;
          margin:0 auto 20px;
          box-shadow:0 0 40px rgba(79,142,247,0.2)">
          <div style="
            width:170px;height:170px;
            border-radius:50%;
            background:var(--surface);
            display:flex;flex-direction:column;
            align-items:center;justify-content:center">
            <div id="pomo-time" style="
              font-size:2.5rem;font-weight:800;
              font-family:Syne,sans-serif;
              color:var(--text)">25:00</div>
            <div id="pomo-mode" style="
              font-size:0.75rem;color:var(--muted);
              margin-top:4px">FOCUS</div>
          </div>
        </div>

        <div style="display:flex;gap:10px;justify-content:center;
        flex-wrap:wrap;margin-bottom:20px">
          <button onclick="togglePomodoro()" 
          id="pomo-btn" class="btn-notes">▶ Start</button>
          <button onclick="resetPomodoro()" 
          class="btn-notes" style="background:#fb923c">
          ↺ Reset</button>
        </div>

        <div style="color:var(--muted);font-size:0.85rem">
          Sessions completed today: 
          <strong id="pomo-sessions" style="color:#fbbf24">0</strong>
        </div>
      </div>

      <div class="notes-card">
        <h4 style="color:var(--accent);margin-bottom:16px">
        ⚙️ Settings</h4>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div>
            <label style="color:var(--muted);font-size:0.8rem">
            Focus Duration (minutes)</label>
            <input type="number" id="pomo-focus" 
            value="25" min="1" max="90" 
            style="width:100px;margin-top:6px"/>
          </div>
          <div>
            <label style="color:var(--muted);font-size:0.8rem">
            Break Duration (minutes)</label>
            <input type="number" id="pomo-break" 
            value="5" min="1" max="30" 
            style="width:100px;margin-top:6px"/>
          </div>
          <div>
            <label style="color:var(--muted);font-size:0.8rem">
            What are you studying?</label>
            <input type="text" id="pomo-task" 
            placeholder="e.g. Chapter 3 Biology"
            style="margin-top:6px"/>
          </div>
        </div>
      </div>

      <div class="notes-card" style="margin-top:16px">
        <h4 style="color:var(--accent);margin-bottom:12px">
        📖 How Pomodoro Works</h4>
        <div style="color:var(--muted);font-size:0.85rem;
        line-height:1.8">
          <p>1️⃣ Choose a task to work on</p>
          <p>2️⃣ Set timer for 25 minutes</p>
          <p>3️⃣ Work until timer rings</p>
          <p>4️⃣ Take a 5 minute break</p>
          <p>5️⃣ Every 4 sessions take longer break</p>
        </div>
      </div>
    </div>
  `;
}

let pomoInterval = null;
let pomoRunning = false;
let pomoSeconds = 25 * 60;
let pomoIsBreak = false;
let pomoSessions = 0;

function updatePomoDisplay() {
  const m = Math.floor(pomoSeconds / 60).toString().padStart(2, '0');
  const s = (pomoSeconds % 60).toString().padStart(2, '0');
  document.getElementById('pomo-time').textContent = m + ':' + s;

  const total = pomoIsBreak
    ? parseInt(document.getElementById('pomo-break').value) * 60
    : parseInt(document.getElementById('pomo-focus').value) * 60;
  const pct = ((total - pomoSeconds) / total) * 100;
  document.getElementById('pomo-circle').style.background =
    'conic-gradient(#4f8ef7 ' + pct + '%, #232840 ' + pct + '%)';
}

function togglePomodoro() {
  if (pomoRunning) {
    clearInterval(pomoInterval);
    pomoRunning = false;
    document.getElementById('pomo-btn').textContent = '▶ Resume';
  } else {
    pomoRunning = true;
    document.getElementById('pomo-btn').textContent = '⏸ Pause';
    pomoInterval = setInterval(() => {
      pomoSeconds--;
      if (pomoSeconds <= 0) {
        clearInterval(pomoInterval);
        pomoRunning = false;
        if (!pomoIsBreak) {
          pomoSessions++;
          document.getElementById('pomo-sessions')
            .textContent = pomoSessions;
          alert('🎉 Focus session complete! Take a break!');
          pomoIsBreak = true;
          pomoSeconds = parseInt(
            document.getElementById('pomo-break').value) * 60;
          document.getElementById('pomo-mode')
            .textContent = 'BREAK';
        } else {
          alert('Break over! Time to focus! 💪');
          pomoIsBreak = false;
          pomoSeconds = parseInt(
            document.getElementById('pomo-focus').value) * 60;
          document.getElementById('pomo-mode')
            .textContent = 'FOCUS';
        }
        document.getElementById('pomo-btn')
          .textContent = '▶ Start';
      }
      updatePomoDisplay();
    }, 1000);
  }
}

function resetPomodoro() {
  clearInterval(pomoInterval);
  pomoRunning = false;
  pomoIsBreak = false;
  pomoSeconds = parseInt(
    document.getElementById('pomo-focus').value) * 60;
  document.getElementById('pomo-btn').textContent = '▶ Start';
  document.getElementById('pomo-mode').textContent = 'FOCUS';
  updatePomoDisplay();
}