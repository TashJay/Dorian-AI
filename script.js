document.addEventListener('DOMContentLoaded', () => {

// --- STATE & CONSTANTS ---
const geminiApiKey = "AIzaSyBTjCw0E5fJwFdDxP1sJvxBnPygEU3Npkw";
const appState = {
isLoggedIn: false,
currentPage: 'login-screen',
selectedCountry: 'United States',
chatHistory: [],
};

// --- ELEMENT SELECTORS ---
const loginScreen = document.getElementById('login-screen');
const mainAppScreen = document.getElementById('main-app');
const allPages = document.querySelectorAll('.page-content');
const navItems = document.querySelectorAll('.nav-item');
const loginButtons = document.querySelectorAll('#login-screen .btn');
const logoutButton = document.getElementById('logout-btn');
const countryModal = document.getElementById('country-modal');
const countrySearchInput = document.getElementById('country-search');
const countryDatalist = document.getElementById('country-list');
const countryContinueBtn = document.getElementById('country-continue-btn');
const chatLog = document.getElementById('chat-log');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const uploadBtn = document.getElementById('upload-btn');
const knowledgeList = document.querySelector('.knowledge-list');

// --- KNOWLEDGE & DATA ---
const countries = [ "United States", "United Kingdom", "Canada", "Australia", "New Zealand", "India", "South Africa", "Nigeria", "Germany", "France", "Spain", "Italy", "Japan", "Brazil", "Mexico", "Argentina", "China", "Russia", "Other"];
const knowledgeItemsData = [
{ icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h11.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2H4.25zM2 11.75A2.25 2.25 0 014.25 9.5h11.5A2.25 2.25 0 0118 11.75v2.5A2.25 2.25 0 0115.75 16.5H4.25A2.25 2.25 0 012 14.25v-2.5z" clip-rule="evenodd" /></svg>', text: 'Scales of Justice' },
{ icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.957 9.957 0 0010 12c-2.31 0-4.438.784-6.131 2.095z" /></svg>', text: 'Legal Aid' },
{ icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 2c-4.418 0-8 3.134-8 7 0 2.04.784 3.915 2.113 5.387l-1.127 3.382a.5.5 0 00.63.63l3.382-1.127A8.953 8.953 0 0010 18c4.418 0 8-3.134 8-7s-3.582-7-8-7zM5 10a1 1 0 11-2 0 1 1 0 012 0zm5-1a1 1 0 100 2 1 1 0 000-2zm5 1a1 1 0 11-2 0 1 1 0 012 0z" clip-rule="evenodd" /></svg>', text: 'Legal Advice' },
{ icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a3 3 0 100-6 3 3 0 000 6zM1.464 14.464A9.955 9.955 0 015.5 13c1.61 0 3.083.433 4.25 1.153a.75.75 0 01-.856 1.303A8.46 8.46 0 005.5 14.5c-1.84 0-3.522.573-4.88 1.54a.75.75 0 01-.156-1.576zM19.536 14.464a.75.75 0 01-.156 1.576A8.46 8.46 0 0014.5 14.5c-1.84 0-3.522.573-4.88 1.54a.75.75 0 11-.856-1.303A9.955 9.955 0 0114.5 13c1.61 0 3.083.433 4.25 1.153a.75.75 0 01.786 1.311z" /></svg>', text: 'Legal Representation' },
{ icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h12v12H4V4z" clip-rule="evenodd" /><path d="M6 6h8v2H6V6zm0 4h8v2H6v-2zm0 4h5v2H6v-2z" /></svg>', text: 'Legal Resources' }
];

// --- INITIALIZATION ---
const init = () => {
populateCountryList();
populateKnowledgeList();
checkAuth();

// --- EVENT LISTENERS ---
loginButtons.forEach(button => button.addEventListener('click', handleLogin));
logoutButton.addEventListener('click', handleLogout);
countrySearchInput.addEventListener('input', validateCountrySelection);
countryContinueBtn.addEventListener('click', finishOnboarding);
navItems.forEach(item => item.addEventListener('click', handleNavigation));
chatForm.addEventListener('submit', handleChatSubmit);
chatInput.addEventListener('input', toggleSendButton);
uploadBtn.addEventListener('click', () => alert('Document upload coming soon!'));
};

// --- AUTH & ONBOARDING ---
const checkAuth = () => {
if (localStorage.getItem('dorianIsLoggedIn') === 'true') {
appState.isLoggedIn = true;
appState.selectedCountry = localStorage.getItem('dorianCountry') || 'United States';
showMainApp();
} else {
showLoginScreen();
}
};

const handleLogin = () => {
countryModal.classList.remove('hidden');
};

const finishOnboarding = () => {
appState.isLoggedIn = true;
appState.selectedCountry = countrySearchInput.value;
localStorage.setItem('dorianIsLoggedIn', 'true');
localStorage.setItem('dorianCountry', appState.selectedCountry);

countryModal.classList.add('hidden');
showMainApp();
};

const handleLogout = () => {
localStorage.removeItem('dorianIsLoggedIn');
localStorage.removeItem('dorianCountry');
appState.isLoggedIn = false;
appState.chatHistory = [];
location.reload(); // Easiest way to reset state and show login
};

const showMainApp = () => {
loginScreen.classList.add('hidden');
mainAppScreen.classList.remove('hidden');
navigateTo('chat-screen');
addInitialBotMessage();
};

const showLoginScreen = () => {
loginScreen.classList.remove('hidden');
mainAppScreen.classList.add('hidden');
};

// --- NAVIGATION ---
const handleNavigation = (e) => {
const targetPage = e.currentTarget.dataset.page;
navigateTo(targetPage);
};

const navigateTo = (pageId) => {
allPages.forEach(page => page.classList.add('hidden'));
document.getElementById(pageId).classList.remove('hidden');

navItems.forEach(item => {
item.classList.toggle('active', item.dataset.page === pageId);
});
appState.currentPage = pageId;
};

// --- UI POPULATION & HELPERS ---
const populateCountryList = () => {
countries.forEach(country => {
const option = document.createElement('option');
option.value = country;
countryDatalist.appendChild(option);
});
};

const populateKnowledgeList = () => {
knowledgeItemsData.forEach(item => {
const li = document.createElement('li');
li.className = 'knowledge-item';
li.innerHTML = `
<div class="icon-container">${item.icon}</div>
<span>${item.text}</span>
`;
knowledgeList.appendChild(li);
});
};

const validateCountrySelection = () => {
countryContinueBtn.disabled = !countries.includes(countrySearchInput.value);
};

const toggleSendButton = () => {
sendBtn.classList.toggle('hidden', chatInput.value.trim() === '');
uploadBtn.classList.toggle('hidden', chatInput.value.trim() !== '');
};

// --- CHAT LOGIC ---
const addInitialBotMessage = () => {
if (chatLog.children.length === 0) {
addMessageToLog('ai', 'Hi there! How can I help you today?');
}
};

const addMessageToLog = (sender, text) => {
const actorName = sender === 'ai' ? 'Dorian AI' : 'You';
const avatarSrc = sender === 'ai' ? 'assets/avatar-dorian.png' : 'assets/avatar-user.png';

const nameDiv = document.createElement('div');
nameDiv.className = `chat-actor-name ${sender}`;
nameDiv.textContent = actorName;

const wrapper = document.createElement('div');
wrapper.className = `chat-bubble-wrapper ${sender}`;

wrapper.innerHTML = `
<img src="${avatarSrc}" alt="${actorName} avatar" class="avatar">
<div class="chat-bubble ${sender}">${text}</div>
`;

chatLog.appendChild(nameDiv);
chatLog.appendChild(wrapper);
chatLog.scrollTop = chatLog.scrollHeight;
};

const handleChatSubmit = async (e) => {
e.preventDefault();
const userInput = chatInput.value.trim();
if (!userInput) return;

addMessageToLog('user', userInput);
chatInput.value = '';
toggleSendButton();

// Add a "thinking" bubble
const thinkingBubble = document.createElement('div');
thinkingBubble.innerHTML = '<span class="thinking-dots">...</span>';
addMessageToLog('ai', thinkingBubble.innerHTML);
const lastBubble = chatLog.querySelector('.chat-bubble-wrapper:last-child .chat-bubble');

// Prepare for API Call
if (appState.chatHistory.length === 0) {
const systemPrompt = `You are Dorian, an AI legal information assistant. Your user is from ${appState.selectedCountry}. All of your responses must be strictly based on the constitutional laws and legal framework of ${appState.selectedCountry}. At the end of every response, you MUST include this exact disclaimer: "Disclaimer: I am an AI assistant and not a lawyer. This information is for educational purposes only. Consult with a qualified legal professional for advice on your specific situation."`;
appState.chatHistory.push({ role: "user", parts: [{ text: systemPrompt }] });
appState.chatHistory.push({ role: "model", parts: [{ text: `Understood.` }] });
}

appState.chatHistory.push({ role: "user", parts: [{ text: userInput }] });

try {
const payload = { contents: appState.chatHistory };
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload)
});

if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

const result = await response.json();
const aiResponse = result.candidates[0].content.parts[0].text;

// Update the "thinking" bubble with the real response
lastBubble.innerHTML = aiResponse.replace(/\n/g, '<br>');
appState.chatHistory.push({ role: "model", parts: [{ text: aiResponse }] });

} catch (error) {
console.error("API Error:", error);
lastBubble.innerHTML = "Sorry, I encountered an error. Please try again.";
lastBubble.style.color = '#ff8a8a';
}
};

// --- START THE APP ---
init();
});