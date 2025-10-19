import { AppData } from './data.js';
import { DateUtils, ViewManager } from './utils.js'; 
import { 
    getSavedEntries, 
    saveEntry, 
    loadEntry, 
    getCustomPrompts, 
    saveCustomPrompts 
} from './journal_storage.js';

let currentJournalKey = '';

// --- Helper Functions (Private to this module) ---
const helpers = {
    getAllPrompts: function() { return [...AppData.DEFAULT_PROMPTS, ...getCustomPrompts()]; },

    deleteCustomPrompt: function(index) {
        let prompts = getCustomPrompts();
        if (index >= 0 && index < prompts.length) {
            prompts.splice(index, 1);
            saveCustomPrompts(prompts);
        }
    },

    renderPromptSelect: function() {
        const select = document.getElementById('promptSelect');
        select.innerHTML = '';
        this.getAllPrompts().forEach((prompt) => {
            const option = document.createElement('option');
            option.value = prompt.template;
            option.textContent = prompt.name;
            select.appendChild(option);
        });
    },

    renderCustomPromptList: function() {
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
                    this.deleteCustomPrompt(index);
                    this.renderCustomPromptList();
                    this.renderPromptSelect();
                }
            };
            li.appendChild(deleteBtn);
            listElement.appendChild(li);
        });
    },

    renderEntryList: function() {
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
            viewButton.onclick = () => JournalLogic.showJournalEntryView(key); // Use public API
            li.appendChild(viewButton);
            entryListElement.appendChild(li);
        });
    }
};

// --- Exported Logic Module ---
export const JournalLogic = {
    showJournalEntryView: function(dateKey = null) {
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
        document.querySelector('#journalEntryView h2').textContent = DateUtils.formatDateForDisplay(dateKey);
        
        helpers.renderPromptSelect();
    },

    showJournalListView: function() {
        ViewManager.displayAppView('journalView');
        document.getElementById('journalEntryView').style.display = 'none';
        document.getElementById('journalList').style.display = 'block';
        document.getElementById('promptManagerView').style.display = 'none';
        helpers.renderEntryList();
    },

    showPromptManagerView: function() {
        ViewManager.displayAppView('journalView');
        document.getElementById('journalEntryView').style.display = 'none';
        document.getElementById('journalList').style.display = 'none';
        document.getElementById('promptManagerView').style.display = 'block';
        helpers.renderCustomPromptList.call(helpers);
    },

    // --- Event Handlers ---
    handleSave: function() {
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
    handleDateChange: function(event) {
        if (event.target.value) this.showJournalEntryView(event.target.value);
    },
    handlePromptAdd: function() {
        const input = document.getElementById('customPromptInput');
        const template = input.value.trim();
        if (template) {
            let prompts = getCustomPrompts();
            prompts.push({ name: template, template: template });
            saveCustomPrompts(prompts);
            input.value = '';
            helpers.renderCustomPromptList.call(helpers);
            helpers.renderPromptSelect.call(helpers);
            alert('Custom Prompt Added!');
        } else {
            alert('Please enter prompt text.');
        }
    },
    handlePromptSelect: function(event) {
        const template = event.target.value;
        const textarea = document.getElementById('journalEntry');
        if (template) {
            if (textarea.value.trim() === "" || confirm("Applying a template will overwrite your current entry. Continue?")) {
                textarea.value = template;
            }
        }
        event.target.value = ''; // Reset select
    },

    bindEventListeners: function() {
        document.getElementById('entryHomeBtn').addEventListener('click', () => ViewManager.displayAppView('homeScreen'));
        document.getElementById('openListHomeBtn').addEventListener('click', () => ViewManager.displayAppView('homeScreen'));
        document.getElementById('managePromptsBtn').addEventListener('click', this.showPromptManagerView.bind(this));
        document.getElementById('backToEntryBtn').addEventListener('click', () => this.showJournalEntryView(currentJournalKey));
        document.getElementById('addCustomPromptBtn').addEventListener('click', this.handlePromptAdd.bind(this));
        document.getElementById('promptSelect').addEventListener('change', this.handlePromptSelect.bind(this));
        document.getElementById('saveJournalBtn').addEventListener('click', this.handleSave.bind(this));
        document.getElementById('entryDate').addEventListener('change', this.handleDateChange.bind(this));
        document.getElementById('viewAllEntriesBtn').addEventListener('click', this.showJournalListView.bind(this));
        document.getElementById('newEntryBtn').addEventListener('click', () => this.showJournalEntryView());
    }
};


