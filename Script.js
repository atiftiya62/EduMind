const GEMINI_API_KEY = 'AIzaSyBagFB9YKZfy7a8S-s3TIKsgJyQSK3Yojks'; // Add your Gemini API key here
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-latest:generateContent?key=`;

// Async function to call Gemini AI
async function callAI(prompt) {
  try {
    const response = await fetch(`${GEMINI_URL} {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text;
    }
    return 'No response from AI.';
  } catch (error) {
    console.error('AI call failed:', error);
    return 'Error: AI request failed. Check API key and network.';
  }
}

// Function to show specific page and update active nav
function showPage(id) {
  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.style.display = 'none';
  });
  
  // Show target page
  const targetPage = document.getElementById(id);
  if (targetPage) {
    targetPage.style.display = 'block';
  }
  
  // Update active nav link
  const links = document.querySelectorAll('.sidebar li a');
  links.forEach(link => {
    link.classList.remove('active');
  });
  
  const activeLink = document.querySelector(`a[href="#${id}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
}

// Window onload - default to learn page
window.addEventListener('load', () => {
  showPage('learn');
});
