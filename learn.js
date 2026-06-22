function renderLearnPage() {
  document.getElementById("learn-content").innerHTML = `
    <input type="text" id="topic-input" placeholder="Enter any topic..." />
    <select id="level-select">
      <option value="beginner">Beginner</option>
      <option value="intermediate">Intermediate</option>
      <option value="advanced">Advanced</option>
    </select>
    <button class="btn-primary" onclick="generateSummary()">Generate Summary</button>
    <button class="btn-primary" onclick="generateDescription()">Generate Description</button>
    <button class="btn-primary" onclick="generateMnemonics()">Generate Mnemonics</button>
    <button class="btn-primary" onclick="generateKeypoints()">Generate Key Points</button>

    <div id="summary-output"></div>
    <div id="description-output"></div>
    <div id="mnemonic-output"></div>
    <div id="keypoints-output"></div>
  `;
}

async function generateSummary() {
  document.getElementById("summary-output").innerText = "";
  document.getElementById("description-output").innerText = "";
  document.getElementById("mnemonic-output").innerText = "";
  document.getElementById("keypoints-output").innerText = "";

  const topic = document.getElementById("topic-input").value.trim();
  const level = document.getElementById("level-select").value;

  if (!topic) {
    alert("Please enter a topic.");
    return;
  }

  document.getElementById("summary-output").innerText = "Loading...";
  const result = await callAI(
    "Write a summary of " + topic + " for " + level + " student.",
  );
  document.getElementById("summary-output").innerText = result;
}

async function generateDescription() {
  document.getElementById("summary-output").innerText = "";
  document.getElementById("description-output").innerText = "";
  document.getElementById("mnemonic-output").innerText = "";
  document.getElementById("keypoints-output").innerText = "";

  const topic = document.getElementById("topic-input").value.trim();
  const level = document.getElementById("level-select").value;

  if (!topic) {
    alert("Please enter a topic.");
    return;
  }

  document.getElementById("description-output").innerText = "Loading...";
  const result = await callAI(
    "Write a description of " + topic + " for " + level + " student.",
  );
  document.getElementById("description-output").innerText = result;
}

async function generateMnemonics() {
  document.getElementById("summary-output").innerText = "";
  document.getElementById("description-output").innerText = "";
  document.getElementById("mnemonic-output").innerText = "";
  document.getElementById("keypoints-output").innerText = "";

  const topic = document.getElementById("topic-input").value.trim();
  const level = document.getElementById("level-select").value;

  if (!topic) {
    alert("Please enter a topic.");
    return;
  }

  document.getElementById("mnemonic-output").innerText = "Loading...";
  const result = await callAI(
    "Create 2 mnemonics for " + topic + " for " + level + " student.",
  );
  document.getElementById("mnemonic-output").innerText = result;
}

async function generateKeypoints() {
  document.getElementById("summary-output").innerText = "";
  document.getElementById("description-output").innerText = "";
  document.getElementById("mnemonic-output").innerText = "";
  document.getElementById("keypoints-output").innerText = "";

  const topic = document.getElementById("topic-input").value.trim();
  const level = document.getElementById("level-select").value;

  if (!topic) {
    alert("Please enter a topic.");
    return;
  }

  document.getElementById("keypoints-output").innerText = "Loading...";
  const result = await callAI(
    "List 7 key points about " + topic + " for " + level + " student.",
  );
  document.getElementById("keypoints-output").innerText = result;
}
