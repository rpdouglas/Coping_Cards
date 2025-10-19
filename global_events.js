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

// --- Core App Logic ---
export const App = {
    initializeApp: function() {
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
        // FIX: This line was causing a crash on startup because the 'statusText' element is not on the home screen.
        // The status is correctly updated by other functions when the card view is active.
        // CardLogic.updateStatus(); 
        TodoLogic.updateRecurringTasks();
        ViewManager.displayAppView('homeScreen');
        
        // Bind all event listeners
        this.bindEventListeners();
    },

    bindEventListeners: function() {
        // --- Home Screen Navigation ---
        document.getElementById('goToCardsBtn').addEventListener('click', CardLogic.drawAndDisplayCard.bind(CardLogic));
        document.getElementById('goToJournalBtn').addEventListener('click', JournalLogic.showJournalEntryView.bind(JournalLogic));
        document.getElementById('goToTodoBtn').addEventListener('click', () => { 
            ViewManager.displayAppView('todoView'); 
            TodoLogic.renderTodoList.call(TodoLogic);
        });
        document.getElementById('goToLiteratureBtn').addEventListener('click', LiteratureLogic.showLiteratureView.bind(LiteratureLogic));
        document.getElementById('goToWorkbooksBtn').addEventListener('click', WorkbookLogic.showWorkbooksHome.bind(WorkbookLogic));
        document.getElementById('goToReflectionBtn').addEventListener('click', ReflectionLogic.showReflectionView.bind(ReflectionLogic));
        document.getElementById('goToJFTBtn').addEventListener('click', ReflectionLogic.showJFTView.bind(ReflectionLogic));
        document.getElementById('goToSettingsBtn').addEventListener('click', SettingsLogic.showSettingsView.bind(SettingsLogic));

        // --- Delegate bindings for buttons INSIDE other views ---
        CardLogic.bindEventListeners();
        JournalLogic.bindEventListeners();
        WorkbookLogic.bindEventListeners();
        LiteratureLogic.bindEventListeners();
        SettingsLogic.bindEventListeners();
        TodoLogic.bindEventListeners();
        ReflectionLogic.bindEventListeners();
    }
};


