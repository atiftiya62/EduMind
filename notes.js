
function renderNotesPage() {
  document.getElementById('notes-content').innerHTML = `
    <div class="notes-container">
      <h2>📝 Generate Study Notes</h2>
      <input type="text" id="notes-topic" 
      placeholder="Enter topic for notes..." />
      <select id="notes-level">
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
      <button onclick="generateNotes()" 
      class="btn-notes">Generate Notes</button>
      <div id="notes-output"></div>
    </div>
  `;
}

async function generateNotes() {
  const topic = document.getElementById('notes-topic').value;
  const level = document.getElementById('notes-level').value;
  if (!topic) { alert('Please enter a topic!'); return; }

  document.getElementById('notes-output').innerHTML = 
    '<p style="color:#7b82a8">Loading your notes...</p>';

  const prompt = 'Create study notes for ' + topic + ' for ' + level + ' student. Use EXACTLY these headers in your response: OVERVIEW: then KEY CONCEPTS: then IMPORTANT FACTS: then EXAMPLES: then KEY POINTS: . Under each header write the content. For KEY CONCEPTS and IMPORTANT FACTS and KEY POINTS start each point with a dash - symbol.';

  const result = await callAI(prompt);

  // Split into sections
  const sections = [
    { 
      key: 'OVERVIEW', 
      icon: '🔵', 
      color: '#4f8ef7', 
      bg: 'rgba(79,142,247,0.08)' 
    },
    { 
      key: 'KEY CONCEPTS', 
      icon: '🟣', 
      color: '#a78bfa', 
      bg: 'rgba(167,139,250,0.08)' 
    },
    { 
      key: 'IMPORTANT FACTS', 
      icon: '🟠', 
      color: '#fb923c', 
      bg: 'rgba(251,146,60,0.08)' 
    },
    { 
      key: 'EXAMPLES', 
      icon: '🟢', 
      color: '#34d399', 
      bg: 'rgba(52,211,153,0.08)' 
    },
    { 
      key: 'KEY POINTS', 
      icon: '🏷️', 
      color: '#fbbf24', 
      bg: 'rgba(251,191,36,0.08)' 
    }
  ];

  let html = `<div class="notes-card">
    <h3 style="color:var(--accent);margin-bottom:20px">
    📚 Notes: ${topic}</h3>`;

  sections.forEach((section, i) => {
    const nextSection = sections[i + 1];
    let sectionText = '';

    const startIndex = result.indexOf(section.key + ':');
    if (startIndex !== -1) {
      const endIndex = nextSection 
        ? result.indexOf(nextSection.key + ':') 
        : result.length;
      sectionText = result
        .substring(startIndex + section.key.length + 1, endIndex)
        .trim();
    }

    if (sectionText) {
      // Style bullet points
      const styledText = sectionText
        .split('\n')
        .map(line => {
          if (line.trim().startsWith('-')) {
            return `<div style="
              background:${section.bg};
              border-left:3px solid ${section.color};
              padding:8px 12px;
              margin:6px 0;
              border-radius:6px;
              color:${section.color};
              font-weight:500">
              ${line.trim().substring(1).trim()}
            </div>`;
          }
          return `<p style="margin:6px 0;line-height:1.7">
            ${line}</p>`;
        })
        .join('');

      html += `
        <div style="
          border-left:4px solid ${section.color};
          padding:16px;
          margin-bottom:16px;
          border-radius:8px;
          background:${section.bg}">
          <h4 style="color:${section.color};margin-bottom:12px">
            ${section.icon} ${section.key}
          </h4>
          ${styledText}
        </div>`;
    }
  });

  html += '</div>';
  document.getElementById('notes-output').innerHTML = html;
}