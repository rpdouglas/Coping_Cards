import { AppData } from './data.js';
import { Storage } from './storage.js';
import { JournalEventHandlers, showJournalEntryView, showJournalListView, showPromptManagerView } from './journal.js'; 
import { LiteratureLogic } from './literature.js'; // NEW: Literature module import
import { CardLogic } from './coping_cards.js'; // Coping Cards module import

// ----------------------------------------------------------------------
// Global Constants and State
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

// --- To Do List Logic (minimal functions exported) ---
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
        list.push({ 
            task: task, 
            completed: false,
            dueDate: dueDate || '', 
            recurrence: recurrence || 'none'
        });
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
        const now = DateUtils.getFormattedDate(new Date());
        let updated = false;

        list.forEach((item) => {
            if (item.completed && item.recurrence !== 'none' && item.dueDate) {
                const taskDueDate = item.dueDate;
                if (taskDueDate < now) {
                    let nextDate = new Date(taskDueDate);
                    
                    while (DateUtils.getFormattedDate(nextDate) < now) {
                        const originalDate = new Date(nextDate);
                        
                        switch (item.recurrence) {
                            case 'daily':
                                nextDate.setDate(originalDate.getDate() + 1);
                                break;
                            case 'weekly':
                                nextDate.setDate(originalDate.getDate() + 7);
                                break;
                            case 'biweekly':
                                nextDate.setDate(originalDate.getDate() + 14);
                                break;
                            case 'monthly':
                                nextDate.setMonth(originalDate.getMonth() + 1);
                                if (nextDate.getDate() !== originalDate.getDate()) {
                                    nextDate.setDate(0); 
                                }
                                break;
                            case 'yearly':
                                nextDate.setFullYear(originalDate.getFullYear() + 1);
                                break;
                        }
                        if (DateUtils.getFormattedDate(nextDate) < now) {
                            item.dueDate = DateUtils.getFormattedDate(nextDate);
                        }
                    }
                    
                    if (item.dueDate !== taskDueDate) {
                        item.completed = false;
                        item.dueDate = DateUtils.getFormattedDate(nextDate);
                        updated = true;
                    }
                }
            }
        });

        if (updated) {
            Storage.saveTodoList(list);
        }
    }
};

// --- Workbook Logic ---
export const WorkbookLogic = {
    showStepOneView: () => {
        ViewManager.displayAppView('stepOneView');
        WorkbookLogic.renderWorkbook('stepOneQuestions', AppData.WORKBOOK_STEP1_QUESTIONS, Storage.getStepOneAnswers, 'saveStepOneBtn', 'stepOneSaveStatus');
    },
    showStepTwoView: () => {
        ViewManager.displayAppView('stepTwoView');
        WorkbookLogic.renderWorkbook('stepTwoQuestions', AppData.WORKBOOK_STEP2_QUESTIONS, Storage.getStepTwoAnswers, 'saveStepTwoBtn', 'stepTwoSaveStatus');
    },
    showStepThreeView: () => {
        ViewManager.displayAppView('stepThreeView');
        WorkbookLogic.renderWorkbook('stepThreeQuestions', AppData.WORKBOOK_STEP3_QUESTIONS, Storage.getStepThreeAnswers, 'saveStepThreeBtn', 'stepThreeSaveStatus');
    },
    showStepFourView: () => { 
        ViewManager.displayAppView('stepFourView');
        WorkbookLogic.renderWorkbook('stepFourQuestions', AppData.WORKBOOK_STEP4_QUESTIONS, Storage.getStepFourAnswers, 'saveStepFourBtn', 'stepFourSaveStatus');
    },
    toggleSection: (headerElement) => {
        const content = headerElement.nextElementSibling;
        const icon = headerElement.querySelector('.collapse-icon');
        content.classList.toggle('collapsed');
        headerElement.classList.toggle('collapsed');
    },
    renderWorkbook: (containerId, questions, getAnswersFn, saveButtonId, saveStatusId) => {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        const answers = getAnswersFn(questions);
        let answerIndex = 0; 
        
        let currentSectionContent = null;
        let isFirstSection = true;
        
        questions.forEach((q) => {
            if (q.isSection) {
                if (currentSectionContent) {
                    container.appendChild(currentSectionContent);
                }
                
                const header = document.createElement('div');
                header.classList.add('workbook-section-header');
                
                if (!isFirstSection) {
                    header.classList.add('collapsed');
                }
                
                const h3 = document.createElement('h3');
                h3.textContent = q.title;
                
                const icon = document.createElement('span');
                icon.classList.add('collapse-icon');
                icon.textContent = '▼';
                
                header.appendChild(h3);
                header.appendChild(icon);
                
                currentSectionContent = document.createElement('div');
                currentSectionContent.classList.add('section-content');
                if (!isFirstSection) {
                    currentSectionContent.classList.add('collapsed');
                }
                
                header.onclick = () => WorkbookLogic.toggleSection(header);
                
                container.appendChild(header);
                isFirstSection = false;
                
                return;
            }
            
            if (currentSectionContent) {
                const div = document.createElement('div');
                div.classList.add('workbook-question');

                const h4 = document.createElement('h4');
                h4.textContent = `${answerIndex + 1}. ${q}`;
                
                const textarea = document.createElement('textarea');
                textarea.setAttribute('data-question-index', answerIndex);
                textarea.value = answers[answerIndex] || ''; 
                textarea.placeholder = 'Write your honest answer here...';

                div.appendChild(h4);
                div.appendChild(textarea);
                currentSectionContent.appendChild(div);
                
                answerIndex++; 
            }
        });
        
        if (currentSectionContent) {
             container.appendChild(currentSectionContent);
        }
        
        document.getElementById(saveStatusId).textContent = '';
        
        // Re-bind save listener since content is dynamically generated
        const saveBtn = document.getElementById(saveButtonId);
        if (saveBtn) {
            saveBtn.onclick = () => WorkbookLogic.collectAndSaveWorkbookAnswers(containerId, saveButtonId, saveStatusId);
        }
    },
    collectAndSaveWorkbookAnswers: (containerId, saveButtonId, saveStatusId) => {
        const textareas = document.querySelectorAll(`#${containerId} textarea`);
        
        let getAnswersFn, saveAnswersFn, questions;
        if (containerId === 'stepOneQuestions') {
            getAnswersFn = Storage.getStepOneAnswers;
            saveAnswersFn = Storage.saveStepOneAnswers;
            questions = AppData.WORKBOOK_STEP1_QUESTIONS;
        } else if (containerId === 'stepTwoQuestions') {
            getAnswersFn = Storage.getStepTwoAnswers;
            saveAnswersFn = Storage.saveStepTwoAnswers;
            questions = AppData.WORKBOOK_STEP2_QUESTIONS;
        } else if (containerId === 'stepThreeQuestions') {
            getAnswersFn = Storage.getStepThreeAnswers;
            saveAnswersFn = Storage.saveStepThreeAnswers;
            questions = AppData.WORKBOOK_STEP3_QUESTIONS;
        } else if (containerId === 'stepFourQuestions') {
            getAnswersFn = Storage.getStepFourAnswers;
            saveAnswersFn = Storage.saveStepFourAnswers;
            questions = AppData.WORKBOOK_STEP4_QUESTIONS;
        } else {
            return;
        }
        
        let answers = getAnswersFn(questions);
        
        textareas.forEach(textarea => {
            const index = parseInt(textarea.getAttribute('data-question-index'));
            if (index >= 0 && index < answers.length) {
                answers[index] = textarea.value;
            }
        });

        saveAnswersFn(answers);
        document.getElementById(saveStatusId).textContent = 'Progress Saved!';
        
        setTimeout(() => {
            document.getElementById(saveStatusId).textContent = '';
        }, 3000);
    }
};

// --- Daily Reflection Logic ---
export const ReflectionLogic = {
    showReflectionView: () => {
        ViewManager.displayAppView('reflectionView');
        
        const dateInput = document.getElementById('reflectionDateInput');
        dateInput.max = DateUtils.getFormattedDate(new Date());
        
        const today = DateUtils.getFormattedDate(new Date());
        if (!dateInput.value) {
            dateInput.value = today;
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
        
        if (!GEMINI_API_KEY) {
            spinner.style.display = 'none';
            quoteEl.textContent = "Error: API Key is missing. Cannot fetch Daily Reflection.";
            quoteEl.style.display = 'block';
            readingEl.textContent = "Please ensure a valid API key is configured to use this feature.";
            readingEl.style.display = 'block';
            return;
        }

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

        const apiUrl = GEMINI_API_URL + GEMINI_API_KEY;
        let resultText = "Could not load reflection. Check connectivity or try a different date.";

        const maxRetries = 3;
        let attempt = 0;
        while (attempt < maxRetries) {
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
                        break; 
                    }
                } else {
                    throw new Error(`API returned status ${response.status}`);
                }

            } catch (error) {
                attempt++;
                console.error(`Attempt ${attempt} failed:`, error.message);
                if (attempt >= maxRetries) {
                    resultText = "Error fetching reflection after multiple retries. Check connectivity.";
                    break;
                }
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        spinner.style.display = 'none';
        
        const parts = resultText.split('\n\n');
        
        if (parts.length >= 2 && !resultText.includes("Error")) {
            quoteEl.textContent = parts[0].trim().replace(/^['"]|['"]$/g, '');
            readingEl.innerHTML = parts.slice(1).join('<br><br>').trim();
            quoteEl.style.display = 'block';
            readingEl.style.display = 'block';
        } else {
            quoteEl.textContent = "Error: Content not found or bad response.";
            readingEl.textContent = "The reflection could not be loaded for this date. Try today's date.";
            quoteEl.style.display = 'block';
            readingEl.style.display = 'block';
        }
    },
    
    showJFTView: () => {
        ViewManager.displayAppView('jftView');
        
        const dateInput = document.getElementById('jftDateInput');
        dateInput.max = DateUtils.getFormattedDate(new Date());
        
        const today = DateUtils.getFormattedDate(new Date());
        if (!dateInput.value) {
            dateInput.value = today;
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

        if (!GEMINI_API_KEY) {
            spinner.style.display = 'none';
            quoteEl.textContent = "Error: API Key is missing. Cannot fetch Just For Today.";
            quoteEl.style.display = 'block';
            readingEl.textContent = "Please ensure a valid API key is configured to use this feature.";
            readingEl.style.display = 'block';
            return;
        }

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

        const apiUrl = GEMINI_API_URL + GEMINI_API_KEY;
        let resultText = "Could not load reflection. Check connectivity or try a different date.";

        const maxRetries = 3;
        let attempt = 0;
        while (attempt < maxRetries) {
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
                        break;
                    }
                } else {
                    throw new Error(`API returned status ${response.status}`);
                }

            } catch (error) {
                attempt++;
                console.error(`Attempt ${attempt} failed:`, error.message);
                if (attempt >= maxRetries) {
                    resultText = "Error fetching reflection after multiple retries. Check connectivity.";
                    break;
                }
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        spinner.style.display = 'none';
        
        const parts = resultText.split('\n\n');
        
        if (parts.length >= 2 && !resultText.includes("Error")) {
            quoteEl.textContent = parts[0].trim().replace(/^['"]|['"]$/g, '');
            readingEl.innerHTML = parts.slice(1).join('<br><br>').trim();
            quoteEl.style.display = 'block';
            readingEl.style.display = 'block';
        } else {
            quoteEl.textContent = "Error: Content not found or bad response.";
            readingEl.textContent = "The reflection could not be loaded for this date. Try today's date.";
            quoteEl.style.display = 'block';
            readingEl.style.display = 'block';
        }
    }
};


// --- Initialization and Event Binding ---
export const App = {
    initializeApp: () => {
        // Set Max Dates
        const todayKey = DateUtils.getFormattedDate(new Date());
        const entryDate = document.getElementById('entryDate');
        if (entryDate) entryDate.max = todayKey;
        const soberDateInput = document.getElementById('soberDateInput');
        if (soberDateInput) soberDateInput.max = todayKey;
        const reflectionDateInput = document.getElementById('reflectionDateInput');
        if (reflectionDateInput) reflectionDateInput.max = todayKey;
        const jftDateInput = document.getElementById('jftDateInput');
        if (jftDateInput) jftDateInput.max = todayKey;

        // Initial view setup
        ViewManager.getDailyFact();
        CardLogic.updateStatus();
        ViewManager.updateHomeSobrietyDuration();
        TodoLogic.updateRecurringTasks();
        ViewManager.displayAppView('homeScreen');

        App.bindEventListeners();
    },

    bindEventListeners: () => {
        // --- General Nav ---
        document.getElementById('goToSettingsBtn').addEventListener('click', () => ViewManager.displayAppView('settingsView'));
        document.querySelectorAll('#settingsView button.secondary, #literatureView button.secondary, #workbooksView button.secondary, #reflectionView button.secondary, #jftView button.secondary').forEach(btn => {
            if (btn.id.includes('Home')) {
                btn.addEventListener('click', () => ViewManager.displayAppView('homeScreen'));
            }
        });
        
        document.getElementById('goToJournalBtn').addEventListener('click', () => showJournalEntryView());
        document.getElementById('goToTodoBtn').addEventListener('click', () => { ViewManager.displayAppView('todoView'); TodoLogic.renderTodoList(); });
        document.getElementById('goToLiteratureBtn').addEventListener('click', LiteratureLogic.showLiteratureView); // Using LiteratureLogic module
        document.getElementById('goToWorkbooksBtn').addEventListener('click', () => ViewManager.displayAppView('workbooksView'));
        document.getElementById('goToReflectionBtn').addEventListener('click', ReflectionLogic.showReflectionView); 
        document.getElementById('goToJFTBtn').addEventListener('click', ReflectionLogic.showJFTView);

        // --- Daily Reflection Listener ---
        document.getElementById('reflectionDateInput').addEventListener('change', (e) => {
            ReflectionLogic.getDailyReflection(e.target.value);
        });
        
        // --- Just For Today Listener ---
        document.getElementById('jftDateInput').addEventListener('change', (e) => {
            ReflectionLogic.getJustForToday(e.target.value);
        });

        // --- Workbooks Nav ---
        document.getElementById('goToStep1Btn').addEventListener('click', WorkbookLogic.showStepOneView);
        document.getElementById('goToStep2Btn').addEventListener('click', WorkbookLogic.showStepTwoView);
        document.getElementById('goToStep3Btn').addEventListener('click', WorkbookLogic.showStepThreeView);
        document.getElementById('goToStep4Btn').addEventListener('click', WorkbookLogic.showStepFourView); 
        document.getElementById('stepOneWorkbooksBtn').addEventListener('click', () => ViewManager.displayAppView('workbooksView'));
        document.getElementById('stepTwoWorkbooksBtn').addEventListener('click', () => ViewManager.displayAppView('workbooksView'));
        document.getElementById('stepThreeWorkbooksBtn').addEventListener('click', () => ViewManager.displayAppView('workbooksView'));
        document.getElementById('stepFourWorkbooksBtn').addEventListener('click', () => ViewManager.displayAppView('workbooksView'));
        
        // Workbook Save Bindings: Must be explicitly bound
        document.getElementById('saveStepOneBtn').addEventListener('click', () => WorkbookLogic.collectAndSaveWorkbookAnswers('stepOneQuestions', 'saveStepOneBtn', 'stepOneSaveStatus'));
        document.getElementById('saveStepTwoBtn').addEventListener('click', () => WorkbookLogic.collectAndSaveWorkbookAnswers('stepTwoQuestions', 'saveStepTwoBtn', 'stepTwoSaveStatus'));
        document.getElementById('saveStepThreeBtn').addEventListener('click', () => WorkbookLogic.collectAndSaveWorkbookAnswers('stepThreeQuestions', 'saveStepThreeBtn', 'stepThreeSaveStatus'));
        document.getElementById('saveStepFourBtn').addEventListener('click', () => WorkbookLogic.collectAndSaveWorkbookAnswers('stepFourQuestions', 'saveStepFourBtn', 'stepFourSaveStatus'));
        
        
        // --- Journal Listeners ---
        document.getElementById('entryHomeBtn').addEventListener('click', () => ViewManager.displayAppView('homeScreen'));
        document.getElementById('openListHomeBtn').addEventListener('click', () => ViewManager.displayAppView('homeScreen'));
        document.getElementById('managePromptsBtn').addEventListener('click', showPromptManagerView);
        document.getElementById('backToEntryBtn').addEventListener('click', () => showJournalEntryView(JournalEventHandlers.getCurrentJournalKey()));
        
        document.getElementById('addCustomPromptBtn').addEventListener('click', JournalEventHandlers.handlePromptAdd);
        document.getElementById('promptSelect').addEventListener('change', JournalEventHandlers.handlePromptSelect);
        document.getElementById('saveJournalBtn').addEventListener('click', JournalEventHandlers.handleSave);
        document.getElementById('entryDate').addEventListener('change', JournalEventHandlers.handleDateChange);
        document.getElementById('viewAllEntriesBtn').addEventListener('click', showJournalListView);
        document.getElementById('newEntryBtn').addEventListener('click', () => showJournalEntryView());

        // --- Settings Listeners ---
        document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            const dateStr = document.getElementById('soberDateInput').value;
            if (dateStr && new Date(dateStr) <= new Date()) {
                Storage.saveSoberDate(dateStr);
                ViewManager.updateHomeSobrietyDuration();
                alert('Sober Date Saved!');
            } else {
                alert('Please enter a valid Sober Date in the past.');
            }
        });

        // --- To Do List Listeners ---
        document.getElementById('addTodoBtn').addEventListener('click', () => {
            const input = document.getElementById('todoInput');
            const dateInput = document.getElementById('todoDateInput');
            const recurrenceSelect = document.getElementById('todoRecurrenceSelect');
            
            const task = input.value.trim();
            const dueDate = dateInput.value;
            const recurrence = recurrenceSelect.value;
            
            if (task) {
                TodoLogic.addTodo(task, dueDate, recurrence);
                input.value = '';
                dateInput.value = '';
                recurrenceSelect.value = 'none';
            } else {
                alert('Please enter a task description.');
            }
        });
        document.getElementById('todoHomeBtn').addEventListener('click', () => ViewManager.displayAppView('homeScreen'));

        // Initialize Card Listeners, now imported from coping_cards.js
        CardLogic.bindEventListeners();
    }
};
