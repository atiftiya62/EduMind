function renderDiagramPage() {
  document.getElementById('diagram-content').innerHTML = `
    <div class="notes-container">
      <h2>🗺️ Mind Map Generator</h2>
      <input type="text" id="diagram-topic" 
      placeholder="Enter topic for mind map..." />
      <select id="diagram-level">
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
      <button onclick="generateDiagram()" 
      class="btn-notes">Generate Mind Map</button>
      <div id="diagram-output"></div>
    </div>
  `;
}

async function generateDiagram() {
  const topic = document.getElementById('diagram-topic').value;
  const level = document.getElementById('diagram-level').value;
  if (!topic) { alert('Please enter a topic!'); return; }

  document.getElementById('diagram-output').innerHTML = 
    '<p style="color:#7b82a8">Generating mind map...</p>';

  const prompt = 'Create a mind map for the topic: ' + topic 
  + ' for ' + level + ' level student. '
  + 'Return ONLY a valid Mermaid.js mindmap diagram code. '
  + 'Start with the word mindmap on the first line. '
  + 'Then root(('+topic+')) on second line. '
  + 'Then add 5 main branches with 2-3 sub points each. '
  + 'No explanation, no markdown backticks, just the mindmap code.';

  const result = await callAI(prompt);
  const clean = result.replace(/```mermaid|```/g, '').trim();

  document.getElementById('diagram-output').innerHTML = `
    <div class="notes-card">
      <h3 style="color:var(--accent);margin-bottom:16px">
      🗺️ Mind Map: ${topic}</h3>
      <div class="mermaid">${clean}</div>
    </div>
  `;
  mermaid.init(undefined, document.querySelector('.mermaid'));
}