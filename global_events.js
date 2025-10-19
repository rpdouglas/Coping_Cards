import { AppData } from './data.js';
import { Storage } from './storage.js';
import { JournalLogic } from './journal.js'; 
import { LiteratureLogic } from './literature.js'; 
import { CardLogic } from './coping_cards.js'; 
import { WorkbookLogic } from './workbooks.js';
import { DateUtils, ViewManager } from './utils.js';

// ----------------------------------------------------------------------
// Global Constants and State
// ----------------------------------------------------------------------
export let deck = [...AppData.cards];
export const GEMINI_API_KEY = ""; 
export const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=";

// --- To Do List Logic ---
export const TodoLogic = {
    getRecurrenceLabel: (key) => {
        switch(key) {
            case 'daily': return 'Daily';
            case 'weekly': return 'Weekly';
            case 'biweekly': return 'Bi-Weekly';
            case 'monthly': return 'Monthly';
            case 'yearly': return 'Yearly';
            default: return 'No Repeat';
        }
    },
    renderTodoList: () => {
        TodoLogic.updateRecurringTasks();
        const list = Storage.getTodoList().sort((a, b) => {
            if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
            if (a.dueDate) return -1;
            if (b.dueDate) return 1;
            return 0;
        });

        const todoListElement = document.getElementById('todoList');
        todoListElement.innerHTML = '';

        if (list.length === 0) {
            todoListElement.innerHTML = '<li style="justify-content: center; color: #888;">Your list is clear!</li>';
            return;
        }

        list.forEach((item, index) => {
            const li = document.createElement('li');
            const mainRow = document.createElement('div');
            mainRow.classList.add('todo-main-row');

            const textSpan = document.createElement('span');
            textSpan.textContent = item.task;
            textSpan.classList.add('todo-text');
            if (item.completed) {
                textSpan.classList.add('todo-completed');
            }
            textSpan.onclick = () => TodoLogic.toggleTodoComplete(index);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Remove';
            deleteBtn.classList.add('secondary');
            deleteBtn.style.padding = '5px 10px';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                TodoLogic.deleteTodo(index);
            };
            
            mainRow.appendChild(textSpan);
            mainRow.appendChild(deleteBtn);
            li.appendChild(mainRow);
            
            if (item.dueDate || item.recurrence !== 'none') {
                const details = document.createElement('div');
                details.classList.add('todo-details');
                let detailText = '';
                if (item.dueDate) {
                    detailText += `Due: ${DateUtils.formatDateForDisplayShort(item.dueDate)}`;
                }
                if (item.recurrence && item.recurrence !== 'none') {
                    if (item.dueDate) detailText += ' | ';
                    detailText += `Repeats: ${TodoLogic.getRecurrenceLabel(item.recurrence)}`;
                }
                details.textContent = detailText;
                li.appendChild(details);
            }
            todoListElement.appendChild(li);
        });
    },
    addTodo: (task, dueDate, recurrence) => {
        const list = Storage.getTodoList();
        list.push({ task, completed: false, dueDate: dueDate || '', recurrence: recurrence || 'none' });
        Storage.saveTodoList(list);
        TodoLogic.renderTodoList();
    },
    toggleTodoComplete: (index) => {
        const list = Storage.getTodoList();
        if (list[index]) {
            list[index].completed = !list[index].completed;
            Storage.saveTodoList(list);
            TodoLogic.renderTodoList();
        }
    },
    deleteTodo: (index) => {
        const list = Storage.getTodoList();
        list.splice(index, 1);
        Storage.saveTodoList(list);
        TodoLogic.renderTodoList();
    },
    updateRecurringTasks: () => {
        let list = Storage.getTodoList();
        const now = new Date();
        const todayStr = DateUtils.getFormattedDate(now);
        let updated = false;

        list.forEach((item) => {
            if (item.completed && item.recurrence !== 'none' && item.dueDate && item.dueDate < todayStr) {
                let nextDate = new Date(item.dueDate);
                
                while (DateUtils.getFormattedDate(nextDate) < todayStr) {
                    switch (item.recurrence) {
                        case 'daily': nextDate.setDate(nextDate.getDate() + 1); break;
                        case 'weekly': nextDate.setDate(nextDate.getDate() + 7); break;
                        case 'biweekly': nextDate.setDate(nextDate.getDate() + 14); break;
                        case 'monthly': nextDate.setMonth(nextDate.getMonth() + 1); break;
                        case 'yearly': nextDate.setFullYear(nextDate.getFullYear() + 1); break;
                    }
                }
                item.dueDate = DateUtils.getFormattedDate(nextDate);
                item.completed = false;
                updated = true;
            }
        });
        if (updated) Storage.saveTodoList(list);
    }
};

// --- Daily Reflection Logic ---
export const ReflectionLogic = {
    showReflectionView: () => {
        ViewManager.displayAppView('reflectionView');
        const dateInput = document.getElementById('reflectionDateInput');
        dateInput.max = DateUtils.getFormattedDate(new Date());
        if (!dateInput.value) {
            dateInput.value = DateUtils.getFormattedDate(new Date());
        }
        ReflectionLogic.getDailyReflection(dateInput.value);
    },
    getDailyReflection: async (dateStr) => {
        const dateDisplay = DateUtils.formatDateForDisplay(dateStr);
        const spinner = document.getElementById('reflectionSpinner');
        const quoteEl = document.getElementById('reflectionQuote');
        const readingEl = document.getElementById('reflectionReading');
        quoteEl.style.display = 'none';
        readingEl.style.display = 'none';
        spinner.style.display = 'block';
        quoteEl.textContent = "Loading reflection...";
        quoteEl.style.display = 'block';
        readingEl.textContent = "";

        const userQuery = `Find the AA Daily Reflection for ${dateDisplay}. Provide only the central quote and the main reflection/meditation text. Format the response with the quote first, followed by a double newline, then the reading.`;
        const systemPrompt = "You are a helpful assistant that uses Google Search to find and format the AA Daily Reflection for a given date. Extract the content accurately.";
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
            resultText = "Error fetching reflection. This may be due to a missing API key or connectivity issues.";
        }

        spinner.style.display = 'none';
        const parts = resultText.split('\n\n');
        if (parts.length >= 2 && !resultText.toLowerCase().includes("error")) {
            quoteEl.textContent = parts[0].trim().replace(/^['"]|['"]$/g, '');
            readingEl.innerHTML = parts.slice(1).join('<br><br>').trim();
            quoteEl.style.display = 'block';
            readingEl.style.display = 'block';
        } else {
            quoteEl.textContent = "Error: Content not found.";
            readingEl.textContent = "The reflection could not be loaded. Please ensure your API key is configured correctly or try another date.";
            quoteEl.style.display = 'block';
            readingEl.style.display = 'block';
        }
    },
    showJFTView: () => {
        ViewManager.displayAppView('jftView');
        const dateInput = document.getElementById('jftDateInput');
        dateInput.max = DateUtils.getFormattedDate(new Date());
        if (!dateInput.value) {
            dateInput.value = DateUtils.getFormattedDate(new Date());
        }
        ReflectionLogic.getJustForToday(dateInput.value);
    },
    getJustForToday: async (dateStr) => {
        const dateDisplay = DateUtils.formatDateForDisplay(dateStr);
        const spinner = document.getElementById('jftSpinner');
        const quoteEl = document.getElementById('jftQuote');
        const readingEl = document.getElementById('jftReading');
        quoteEl.style.display = 'none';
        readingEl.style.display = 'none';
        spinner.style.display = 'block';
        quoteEl.textContent = "Loading reflection...";
        quoteEl.style.display = 'block';
        readingEl.textContent = "";

        const userQuery = `Find the NA Just For Today (JFT) reflection for ${dateDisplay}. Provide only the central quote/theme and the main reflection/meditation text. Format the response with the quote/theme first, followed by a double newline, then the reading.`;
        const systemPrompt = "You are a helpful assistant that uses Google Search to find and format the NA Just For Today reflection for a given date. Extract the content accurately.";
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
            console.error("Error fetching JFT:", error);
            resultText = "Error fetching reflection. This may be due to a missing API key or connectivity issues.";
        }

        spinner.style.display = 'none';
        const parts = resultText.split('\n\n');
        if (parts.length >= 2 && !resultText.toLowerCase().includes("error")) {
            quoteEl.textContent = parts[0].trim().replace(/^['"]|['"]$/g, '');
            readingEl.innerHTML = parts.slice(1).join('<br><br>').trim();
            quoteEl.style.display = 'block';
            readingEl.style.display = 'block';
        } else {
            quoteEl.textContent = "Error: Content not found.";
            readingEl.textContent = "The reflection could not be loaded. Please ensure your API key is configured correctly or try another date.";
            quoteEl.style.display = 'block';
            readingEl.style.display = 'block';
        }
    }
};

// --- Initialization and Event Binding ---
export const App = {
    initializeApp: () => {
        const todayKey = DateUtils.getFormattedDate(new Date());
        ['entryDate', 'soberDateInput', 'reflectionDateInput', 'jftDateInput'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.max = todayKey;
        });
        
        const factIndex = Math.floor(Math.random() * AppData.POP_FACTS.length);
        document.getElementById('dailyFactText').textContent = AppData.POP_FACTS[factIndex];
        
        const savedDate = Storage.loadSoberDate();
        document.getElementById('homeSobrietyDuration').textContent = DateUtils.calculateDuration(savedDate);

        CardLogic.updateStatus();
        TodoLogic.updateRecurringTasks();
        ViewManager.displayAppView('homeScreen');
        App.bindEventListeners();
    },
    bindEventListeners: () => {
        CardLogic.bindEventListeners();
        JournalLogic.bindEventListeners();
        WorkbookLogic.bindEventListeners();
        LiteratureLogic.bindEventListeners();

        document.getElementById('goToSettingsBtn').addEventListener('click', () => ViewManager.displayAppView('settingsView'));
        document.getElementById('settingsHomeBtn').addEventListener('click', () => ViewManager.displayAppView('homeScreen'));
        document.getElementById('goToJournalBtn').addEventListener('click', () => JournalLogic.showJournalEntryView());
        document.getElementById('goToTodoBtn').addEventListener('click', () => { ViewManager.displayAppView('todoView'); TodoLogic.renderTodoList(); });
        document.getElementById('goToReflectionBtn').addEventListener('click', ReflectionLogic.showReflectionView);
        document.getElementById('goToJFTBtn').addEventListener('click', ReflectionLogic.showJFTView);
        
        document.getElementById('reflectionDateInput').addEventListener('change', (e) => ReflectionLogic.getDailyReflection(e.target.value));
        document.getElementById('jftDateInput').addEventListener('change', (e) => ReflectionLogic.getJustForToday(e.target.value));
        document.getElementById('reflectionHomeBtn').addEventListener('click', () => ViewManager.displayAppView('homeScreen'));
        document.getElementById('jftHomeBtn').addEventListener('click', () => ViewManager.displayAppView('homeScreen'));
        
        document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            const dateStr = document.getElementById('soberDateInput').value;
            if (dateStr && new Date(dateStr) <= new Date()) {
                Storage.saveSoberDate(dateStr);
                document.getElementById('homeSobrietyDuration').textContent = DateUtils.calculateDuration(dateStr);
                alert('Sober Date Saved!');
            } else {
                alert('Please enter a valid Sober Date in the past.');
            }
        });

        document.getElementById('addTodoBtn').addEventListener('click', () => {
            const input = document.getElementById('todoInput');
            const dateInput = document.getElementById('todoDateInput');
            const recurrenceSelect = document.getElementById('todoRecurrenceSelect');
            if (input.value.trim()) {
                TodoLogic.addTodo(input.value.trim(), dateInput.value, recurrenceSelect.value);
                input.value = '';
                dateInput.value = '';
                recurrenceSelect.value = 'none';
            } else {
                alert('Please enter a task description.');
            }
        });
        document.getElementById('todoHomeBtn').addEventListener('click', () => ViewManager.displayAppView('homeScreen'));
    }
};


