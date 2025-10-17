import { AppData } from './data.js';
import { Storage } from './storage.js';

// ----------------------------------------------------------------------
// Global Constants and State (minimal)
// ----------------------------------------------------------------------
export let deck = [...AppData.cards];
export const GEMINI_API_KEY = typeof __api_key !== 'undefined' ? __api_key : ""; 
export const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=";


// --- Date/Time Helpers ---
export const DateUtils = {
    getFormattedDate: (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    },
    formatDateForDisplayShort: (dateKey) => {
        if (!dateKey) return '';
        const date = new Date(dateKey);
        return date.toLocaleDateString('en-US'); 
    },
    formatDateForDisplay: (dateKey) => {
        const parts = dateKey.split('-');
        if (parts.length === 3) {
            const date = new Date(parts[0], parts[1] - 1, parts[2]);
            return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }
        return dateKey;
    },
    calculateDuration: (soberDateStr) => {
        if (!soberDateStr) return "Enter your date to start tracking!";
        
        const start = new Date(soberDateStr);
        const now = new Date();
        
        if (start > now) return "Date must be in the past.";

        const diffTime = Math.abs(now - start);
        const MS_PER_DAY = 1000 * 60 * 60 * 24;
        const days = Math.floor(diffTime / MS_PER_DAY);
        
        const years = Math.floor(days / 365.25);
        const remainingDays = days % 365.25;
        const months = Math.floor(remainingDays / 30.44);
        
        let output = "Sober for: ";
        if (years > 0) output += `${years} year${years !== 1 ? 's' : ''}, `;
        if (months > 0) output += `${months} month${months !== 1 ? 's' : ''}, and `;
        output += `${days} day${days !== 1 ? 's' : ''} total.`;
        
        return output;
    }
};

// --- View Management ---
export const ViewManager = {
    displayAppView: (viewId) => {
        const views = ['homeScreen', 'cardIntro', 'cardView', 'journalView', 'settingsView', 'todoView', 'literatureView', 'workbooksView', 'stepOneView', 'stepTwoView', 'stepThreeView', 'stepFourView', 'reflectionView', 'jftView'];
        views.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = id === viewId ? 'block' : 'none';
            }
        });
    },
    updateHomeSobrietyDuration: () => {
        const savedDate = Storage.loadSoberDate();
        document.getElementById('homeSobrietyDuration').textContent = DateUtils.calculateDuration(savedDate);
    },
    getDailyFact: () => {
        const factIndex = Math.floor(Math.random() * AppData.POP_FACTS.length);
        document.getElementById('dailyFactText').textContent = AppData.POP_FACTS[factIndex];
    }
};

// Expose essential utilities globally for modules that need them
window.DateUtils = DateUtils;
window.ViewManager = ViewManager;
window.GEMINI_API_KEY = GEMINI_API_KEY;
window.GEMINI_API_URL = GEMINI_API_URL;
