import { ViewManager, DateUtils } from './utils.js';

// --- Constants ---
const GEMINI_API_KEY = ""; 
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=";

// --- Private Helper Functions ---
async function fetchReflection(userQuery, systemPrompt) {
    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        tools: [{ "google_search": {} }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
    };
    const apiUrl = `${GEMINI_API_URL}${GEMINI_API_KEY}`;
    let resultText = "Could not load reflection. Check connectivity or try a different date.";

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            const result = await response.json();
            const candidate = result.candidates?.[0];
            if (candidate && candidate.content?.parts?.[0]?.text) {
                resultText = candidate.content.parts[0].text;
            }
        } else {
            throw new Error(`API returned status ${response.status}`);
        }
    } catch (error) {
        console.error("Error fetching reflection:", error);
        resultText = "Error: This feature requires a valid API key and internet connection.";
    }
    return resultText;
}

function displayReflection(resultText, quoteEl, readingEl, spinnerEl) {
    spinnerEl.style.display = 'none';
    const parts = resultText.split('\n\n');
    if (parts.length >= 2 && !resultText.toLowerCase().includes("error")) {
        quoteEl.textContent = parts[0].trim().replace(/^['"]|['"]$/g, '');
        readingEl.innerHTML = parts.slice(1).join('<br><br>').trim();
        quoteEl.style.display = 'block';
        readingEl.style.display = 'block';
    } else {
        quoteEl.textContent = "Error: Content not found.";
        readingEl.textContent = resultText;
        quoteEl.style.display = 'block';
        readingEl.style.display = 'block';
    }
}

// --- Exported Logic Module ---
export const ReflectionLogic = {
    showReflectionView: function() {
        ViewManager.displayAppView('reflectionView');
        const dateInput = document.getElementById('reflectionDateInput');
        if (!dateInput.value) {
            dateInput.value = DateUtils.getFormattedDate(new Date());
        }
        this.getDailyReflection(dateInput.value);
    },
    
    getDailyReflection: async function(dateStr) {
        const spinner = document.getElementById('reflectionSpinner');
        const quoteEl = document.getElementById('reflectionQuote');
        const readingEl = document.getElementById('reflectionReading');
        quoteEl.style.display = 'none';
        readingEl.style.display = 'none';
        spinner.style.display = 'block';

        const userQuery = `Find the AA Daily Reflection for ${DateUtils.formatDateForDisplay(dateStr)}. Provide only the central quote and the main reflection text. Format with the quote first, a double newline, then the reading.`;
        const systemPrompt = "You are an assistant that finds and formats the AA Daily Reflection for a given date via Google Search.";
        
        const resultText = await fetchReflection(userQuery, systemPrompt);
        displayReflection(resultText, quoteEl, readingEl, spinner);
    },

    showJFTView: function() {
        ViewManager.displayAppView('jftView');
        const dateInput = document.getElementById('jftDateInput');
        if (!dateInput.value) {
            dateInput.value = DateUtils.getFormattedDate(new Date());
        }
        this.getJustForToday(dateInput.value);
    },

    getJustForToday: async function(dateStr) {
        const spinner = document.getElementById('jftSpinner');
        const quoteEl = document.getElementById('jftQuote');
        const readingEl = document.getElementById('jftReading');
        quoteEl.style.display = 'none';
        readingEl.style.display = 'none';
        spinner.style.display = 'block';

        const userQuery = `Find the NA Just For Today (JFT) reflection for ${DateUtils.formatDateForDisplay(dateStr)}. Provide only the central quote/theme and the main reflection text. Format with the quote/theme first, a double newline, then the reading.`;
        const systemPrompt = "You are an assistant that finds and formats the NA Just For Today reflection for a given date via Google Search.";

        const resultText = await fetchReflection(userQuery, systemPrompt);
        displayReflection(resultText, quoteEl, readingEl, spinner);
    },

    bindEventListeners: function() {
        document.getElementById('reflectionDateInput').addEventListener('change', (e) => this.getDailyReflection(e.target.value));
        document.getElementById('jftDateInput').addEventListener('change', (e) => this.getJustForToday(e.target.value));
        document.getElementById('reflectionHomeBtn').addEventListener('click', () => ViewManager.displayAppView('homeScreen'));
        document.getElementById('jftHomeBtn').addEventListener('click', () => ViewManager.displayAppView('homeScreen'));
    }
};

