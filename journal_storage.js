// Key Definitions for Journaling and Prompts
const JOURNAL_KEY = 'addictsAgendaJournalEntries';
const PROMPT_KEY = 'addictsAgendaCustomPrompts';

/**
 * Retrieves all saved journal entries from local storage.
 * @returns {Object} An object mapping date strings to entry content.
 */
export function getSavedEntries() {
    const entriesJson = localStorage.getItem(JOURNAL_KEY);
    return entriesJson ? JSON.parse(entriesJson) : {};
}

/**
 * Saves a single journal entry for a given date.
 * @param {string} dateKey - The date (YYYY-MM-DD) to save the entry under.
 * @param {string} content - The journal entry text.
 */
export function saveEntry(dateKey, content) {
    const entries = getSavedEntries();
    entries[dateKey] = content;
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
}

/**
 * Loads a journal entry for a specific date.
 * @param {string} dateKey - The date (YYYY-MM-DD) to load.
 * @returns {string} The entry content or an empty string.
 */
export function loadEntry(dateKey) {
    const entries = getSavedEntries();
    return entries[dateKey] || '';
}

/**
 * Retrieves user-defined custom prompts.
 * @returns {Array<Object>} List of custom prompts.
 */
export function getCustomPrompts() {
    const promptsJson = localStorage.getItem(PROMPT_KEY);
    return promptsJson ? JSON.parse(promptsJson) : [];
}

/**
 * Saves the current list of custom prompts.
 * @param {Array<Object>} prompts - The full list of custom prompt objects.
 */
export function saveCustomPrompts(prompts) {
    localStorage.setItem(PROMPT_KEY, JSON.stringify(prompts));
}
