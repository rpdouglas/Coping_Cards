import { AppData } from './data.js';
// Import only necessary helpers from app.js; pass in dependencies otherwise
import { ViewManager, DateUtils } from './app.js'; 
import { 
    getSavedEntries, 
    saveEntry, 
    loadEntry, 
    getCustomPrompts, 
    saveCustomPrompts 
} from './journal_storage.js';

let currentJournalKey = '';

// --- Prompt Management Helpers ---

function getAllPrompts() {
    return [...AppData.DEFAULT_PROMPTS, ...getCustomPrompts()];
}

function deleteCustomPrompt(index) {
    let prompts = getCustomPrompts();
    // Adjust index because default prompts are not stored here
    if (index >= 0 && index < prompts.length) {
        prompts.splice(index, 1);
        saveCustomPrompts(prompts);
    }
}

// --- Rendering Functions ---

function renderPromptSelect() {
    const select = document.getElementById('promptSelect');
    select.innerHTML = '';
    const allPrompts = getAllPrompts();

    allPrompts.forEach((prompt, index) => {
        const option = document.createElement('option');
        option.value = prompt.template;
        option.textContent = prompt.name;
        option.setAttribute('data-is-custom', index >= AppData.DEFAULT_PROMPTS.length);
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
        li.style.cursor = 'pointer';
        
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
        
        viewButton.onclick = () => showJournalEntryView(key);

        li.appendChild(viewButton);
        entryListElement.appendChild(li);
    });
}

// --- View Logic ---

/**
 * Shows the main entry view for a specific date (defaults to today).
 * @param {string | null} dateKey - The date (YYYY-MM-DD).
 */
export function showJournalEntryView(dateKey = null) {
    ViewManager.displayAppView('journalView');
    document.getElementById('journalEntryView').style.display = 'block';
    document.getElementById('journalList').style.display = 'none';
    document.getElementById('promptManagerView').style.display = 'none';

    const today = new Date();
    dateKey = dateKey === null ? DateUtils.getFormattedDate(today) : dateKey;

    currentJournalKey = dateKey;
    document.getElementById('entryDate').value = dateKey;
    
    const entryContent = loadEntry(dateKey);
    document.getElementById('journalEntry').value = entryContent;
    
    document.querySelector('#journalEntryView h2').textContent = DateUtils.formatDateForDisplay(new Date(dateKey));
    
    renderPromptSelect(); 
    document.getElementById('promptSelect').value = '';
}

/**
 * Shows the list view of all past journal entries.
 */
export function showJournalListView() {
    ViewManager.displayAppView('journalView');
    document.getElementById('journalEntryView').style.display = 'none';
    document.getElementById('journalList').style.display = 'block';
    document.getElementById('promptManagerView').style.display = 'none';
    renderEntryList();
}

/**
 * Shows the prompt management interface.
 */
export function showPromptManagerView() {
    ViewManager.displayAppView('journalView');
    document.getElementById('journalEntryView').style.display = 'none';
    document.getElementById('journalList').style.display = 'none';
    document.getElementById('promptManagerView').style.display = 'block';
    renderCustomPromptList();
}

// --- Event Handlers (exported for binding in app.js) ---

export const JournalEventHandlers = {
    handleSave: () => {
        const content = document.getElementById('journalEntry').value;
        const dateKey = document.getElementById('entryDate').value;
        
        if (content.trim() === '') {
            alert('Journal entry cannot be empty.');
            return;
        }
        
        if (dateKey) {
            saveEntry(dateKey, content);
            alert(`Entry for ${dateKey} Saved!`);
        } else {
            alert('Please select a date.');
        }
    },
    handleDateChange: (event) => {
        const dateKey = event.target.value;
        if (dateKey) {
            showJournalEntryView(dateKey);
        }
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
            } else {
                event.target.value = '';
            }
        }
    },
    getCurrentJournalKey: () => currentJournalKey
};
