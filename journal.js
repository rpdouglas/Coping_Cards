import { AppData } from './data.js';
// UPDATED: Import from the new utils.js file
import { DateUtils, ViewManager } from './utils.js'; 
import { 
    getSavedEntries, 
    saveEntry, 
    loadEntry, 
    getCustomPrompts, 
    saveCustomPrompts 
} from './journal_storage.js';

let currentJournalKey = '';

// --- Helper Functions ---
function getAllPrompts() { return [...AppData.DEFAULT_PROMPTS, ...getCustomPrompts()]; }

function deleteCustomPrompt(index) {
    let prompts = getCustomPrompts();
    if (index >= 0 && index < prompts.length) {
        prompts.splice(index, 1);
        saveCustomPrompts(prompts);
    }
}

function renderPromptSelect() {
    const select = document.getElementById('promptSelect');
    select.innerHTML = '';
    getAllPrompts().forEach((prompt) => {
        const option = document.createElement('option');
        option.value = prompt.template;
        option.textContent = prompt.name;
        select.appendChild(option);
    });
}

function renderCustomPromptList() {
    const list = getCustomPrompts();
    const listElement = document.getElementById('customPromptList');
    listElement.innerHTML = '';
    if (list.length === 0) {
        listElement.innerHTML = '<li style="justify-content: center; color: #888;">No custom prompts saved.</li>';
        return;
    }
    list.forEach((prompt, index) => {
        const li = document.createElement('li');
        li.textContent = prompt.name;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('secondary');
        deleteBtn.style.padding = '5px 10px';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            if (confirm(`Are you sure you want to delete the prompt: "${prompt.name}"?`)) {
                deleteCustomPrompt(index);
                renderCustomPromptList();
                renderPromptSelect();
            }
        };
        li.appendChild(deleteBtn);
        listElement.appendChild(li);
    });
}

function renderEntryList() {
    const entries = getSavedEntries();
    const entryListElement = document.getElementById('entryList');
    entryListElement.innerHTML = '';
    const sortedKeys = Object.keys(entries).sort().reverse();
    if (sortedKeys.length === 0) {
        entryListElement.innerHTML = '<li>No entries saved yet.</li>';
        return;
    }
    sortedKeys.forEach(key => {
        const li = document.createElement('li');
        li.textContent = DateUtils.formatDateForDisplay(key);
        const viewButton = document.createElement('button');
        viewButton.textContent = 'View';
        viewButton.classList.add('secondary');
        viewButton.style.marginLeft = '10px';
        viewButton.onclick = () => JournalLogic.showJournalEntryView(key);
        li.appendChild(viewButton);
        entryListElement.appendChild(li);
    });
}

// --- Event Handlers ---
const JournalEventHandlers = {
    handleSave: () => {
        const content = document.getElementById('journalEntry').value;
        const dateKey = document.getElementById('entryDate').value;
        if (content.trim() === '') return alert('Journal entry cannot be empty.');
        if (dateKey) {
            saveEntry(dateKey, content);
            alert(`Entry for ${dateKey} Saved!`);
        } else {
            alert('Please select a date.');
        }
    },
    handleDateChange: (event) => {
        if (event.target.value) JournalLogic.showJournalEntryView(event.target.value);
    },
    handlePromptAdd: () => {
        const input = document.getElementById('customPromptInput');
        const template = input.value.trim();
        if (template) {
            let prompts = getCustomPrompts();
            prompts.push({ name: template, template: template });
            saveCustomPrompts(prompts);
            input.value = '';
            renderCustomPromptList();
            renderPromptSelect();
            alert('Custom Prompt Added!');
        } else {
            alert('Please enter prompt text.');
        }
    },
    handlePromptSelect: (event) => {
        const template = event.target.value;
        const textarea = document.getElementById('journalEntry');
        if (template) {
            if (textarea.value.trim() === "" || confirm("Applying a template will overwrite your current entry. Continue?")) {
                textarea.value = template;
            }
        }
        event.target.value = ''; // Reset select to avoid re-triggering
    }
};

// --- Exported Logic Module ---
export const JournalLogic = {
    showJournalEntryView: (dateKey = null) => {
        ViewManager.displayAppView('journalView');
        document.getElementById('journalEntryView').style.display = 'block';
        document.getElementById('journalList').style.display = 'none';
        document.getElementById('promptManagerView').style.display = 'none';

        if (dateKey === null) {
            dateKey = DateUtils.getFormattedDate(new Date());
        }
        currentJournalKey = dateKey;
        
        document.getElementById('entryDate').value = dateKey;
        document.getElementById('journalEntry').value = loadEntry(dateKey);
        // FIX: Pass the correct date string format to the display function
        document.querySelector('#journalEntryView h2').textContent = DateUtils.formatDateForDisplay(dateKey);
        
        renderPromptSelect();
    },
    showJournalListView: () => {
        ViewManager.displayAppView('journalView');
        document.getElementById('journalEntryView').style.display = 'none';
        document.getElementById('journalList').style.display = 'block';
        document.getElementById('promptManagerView').style.display = 'none';
        renderEntryList();
    },
    showPromptManagerView: () => {
        ViewManager.displayAppView('journalView');
        document.getElementById('journalEntryView').style.display = 'none';
        document.getElementById('journalList').style.display = 'none';
        document.getElementById('promptManagerView').style.display = 'block';
        renderCustomPromptList();
    },
    bindEventListeners: () => {
        document.getElementById('entryHomeBtn').addEventListener('click', () => ViewManager.displayAppView('homeScreen'));
        document.getElementById('openListHomeBtn').addEventListener('click', () => ViewManager.displayAppView('homeScreen'));
        document.getElementById('managePromptsBtn').addEventListener('click', JournalLogic.showPromptManagerView);
        document.getElementById('backToEntryBtn').addEventListener('click', () => JournalLogic.showJournalEntryView(currentJournalKey));
        document.getElementById('addCustomPromptBtn').addEventListener('click', JournalEventHandlers.handlePromptAdd);
        document.getElementById('promptSelect').addEventListener('change', JournalEventHandlers.handlePromptSelect);
        document.getElementById('saveJournalBtn').addEventListener('click', JournalEventHandlers.handleSave);
        document.getElementById('entryDate').addEventListener('change', JournalEventHandlers.handleDateChange);
        document.getElementById('viewAllEntriesBtn').addEventListener('click', JournalLogic.showJournalListView);
        document.getElementById('newEntryBtn').addEventListener('click', () => JournalLogic.showJournalEntryView());
    }
};


