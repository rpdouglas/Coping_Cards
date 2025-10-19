import { AppData } from './data.js';
import { Storage } from './storage.js';
import { JournalLogic } from './journal.js';
import { LiteratureLogic } from './literature.js';
import { CardLogic } from './coping_cards.js';
import { WorkbookLogic } from './workbooks.js';
import { DateUtils, ViewManager } from './utils.js';
import { SettingsLogic } from './settings.js';
import { TodoLogic } from './todo.js';
import { ReflectionLogic } from './reflection.js';
// FIX: No longer exporting 'deck' from here to prevent circular dependencies.

// --- Core App Logic ---
export const App = {
    initializeApp: () => {
        // Set max dates on inputs
        const todayKey = DateUtils.getFormattedDate(new Date());
        ['entryDate', 'soberDateInput', 'reflectionDateInput', 'jftDateInput', 'todoDateInput'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.max = todayKey;
        });
        
        // Set initial content on the home screen
        const factIndex = Math.floor(Math.random() * AppData.POP_FACTS.length);
        document.getElementById('dailyFactText').textContent = AppData.POP_FACTS[factIndex];
        
        const savedDate = Storage.loadSoberDate();
        document.getElementById('homeSobrietyDuration').textContent = DateUtils.calculateDuration(savedDate);

        // Run initial setup for modules
        CardLogic.updateStatus();
        TodoLogic.updateRecurringTasks();
        ViewManager.displayAppView('homeScreen');
        
        // Bind all event listeners
        App.bindEventListeners();
    },

    bindEventListeners: () => {
        // --- Navigation from Home Screen ---
        document.getElementById('goToCardsBtn').addEventListener('click', CardLogic.drawAndDisplayCard);
        document.getElementById('goToJournalBtn').addEventListener('click', () => JournalLogic.showJournalEntryView());
        document.getElementById('goToTodoBtn').addEventListener('click', () => { ViewManager.displayAppView('todoView'); TodoLogic.renderTodoList(); });
        document.getElementById('goToLiteratureBtn').addEventListener('click', LiteratureLogic.showLiteratureView);
        document.getElementById('goToWorkbooksBtn').addEventListener('click', WorkbookLogic.showWorkbooksHome);
        document.getElementById('goToReflectionBtn').addEventListener('click', ReflectionLogic.showReflectionView);
        document.getElementById('goToJFTBtn').addEventListener('click', ReflectionLogic.showJFTView);
        document.getElementById('goToSettingsBtn').addEventListener('click', SettingsLogic.showSettingsView);

        // --- Delegate bindings to feature modules ---
        CardLogic.bindEventListeners();
        JournalLogic.bindEventListeners();
        WorkbookLogic.bindEventListeners();
        LiteratureLogic.bindEventListeners();
        SettingsLogic.bindEventListeners();
        TodoLogic.bindEventListeners();
        ReflectionLogic.bindEventListeners();
    }
};


