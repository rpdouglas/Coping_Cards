// --- Storage Module (Refactored from index.html) ---

// Key Definitions
const SOBER_DATE_KEY = 'soberDate';
const TODO_KEY = 'addictsAgendaTodoList'; 
const WORKBOOK_STEP1_KEY = 'addictsAgendaWorkbookStep1'; 
const WORKBOOK_STEP2_KEY = 'addictsAgendaWorkbookStep2'; 
const WORKBOOK_STEP3_KEY = 'addictsAgendaWorkbookStep3'; 
const WORKBOOK_STEP4_KEY = 'addictsAgendaWorkbookStep4'; 
const WORKBOOK_STEP5_KEY = 'addictsAgendaWorkbookStep5';

// General Helpers (Internal)
function get(key, defaultValue = {}) {
    const json = localStorage.getItem(key);
    return json ? JSON.parse(json) : defaultValue;
}
function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Workbook Data (Assumes AppData is imported where used)
function _getWorkbookAnswers(key, questions) {
    const answersJson = localStorage.getItem(key);
    // Filter out section headers to get the actual count of questions
    const defaultAnswers = questions.filter(q => !q.isSection).map(q => "");
    if (answersJson) {
        const savedAnswers = JSON.parse(answersJson);
        if (savedAnswers.length === defaultAnswers.length) {
            return savedAnswers;
        }
        // Handle case where questions might have changed: return a hybrid
        return defaultAnswers.map((defaultVal, i) => savedAnswers[i] !== undefined ? savedAnswers[i] : defaultVal);
    }
    return defaultAnswers;
}

// --- Exported Storage API ---
export const Storage = {
    // To Do List
    getTodoList: () => get(TODO_KEY, []),
    saveTodoList: (list) => set(TODO_KEY, list),
    
    // Sober Date
    loadSoberDate: () => localStorage.getItem(SOBER_DATE_KEY) || '',
    saveSoberDate: (dateStr) => localStorage.setItem(SOBER_DATE_KEY, dateStr),

    // Workbooks (Must be linked with AppData externally)
    getStepOneAnswers: (questions) => _getWorkbookAnswers(WORKBOOK_STEP1_KEY, questions),
    saveStepOneAnswers: (answers) => set(WORKBOOK_STEP1_KEY, answers),
    getStepTwoAnswers: (questions) => _getWorkbookAnswers(WORKBOOK_STEP2_KEY, questions),
    saveStepTwoAnswers: (answers) => set(WORKBOOK_STEP2_KEY, answers),
    getStepThreeAnswers: (questions) => _getWorkbookAnswers(WORKBOOK_STEP3_KEY, questions),
    saveStepThreeAnswers: (answers) => set(WORKBOOK_STEP3_KEY, answers),
    getStepFourAnswers: (questions) => _getWorkbookAnswers(WORKBOOK_STEP4_KEY, questions),
    saveStepFourAnswers: (answers) => set(WORKBOOK_STEP4_KEY, answers),
    getStepFiveAnswers: (questions) => _getWorkbookAnswers(WORKBOOK_STEP5_KEY, questions),
    saveStepFiveAnswers: (answers) => set(WORKBOOK_STEP5_KEY, answers),
};