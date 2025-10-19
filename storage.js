// --- Storage Module ---

// Key Definitions
const SOBER_DATE_KEY = 'soberDate';
const TODO_KEY = 'addictsAgendaTodoList'; 
const WORKBOOK_STEP1_KEY = 'addictsAgendaWorkbookStep1'; 
const WORKBOOK_STEP2_KEY = 'addictsAgendaWorkbookStep2'; 
const WORKBOOK_STEP3_KEY = 'addictsAgendaWorkbookStep3'; 
const WORKBOOK_STEP4_KEY = 'addictsAgendaWorkbookStep4'; 
const WORKBOOK_STEP5_KEY = 'addictsAgendaWorkbookStep5'; // NEW: Key for Step 5

// General Helpers
function get(key, defaultValue = {}) {
    const json = localStorage.getItem(key);
    return json ? JSON.parse(json) : defaultValue;
}
function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Workbook Helper
function _getWorkbookAnswers(key, questions) {
    const answersJson = localStorage.getItem(key);
    const defaultAnswers = questions.filter(q => !q.isSection).map(() => "");
    if (answersJson) {
        const savedAnswers = JSON.parse(answersJson);
        return defaultAnswers.map((defaultVal, i) => savedAnswers[i] !== undefined ? savedAnswers[i] : defaultVal);
    }
    return defaultAnswers;
}

// --- Exported Storage API ---
export const Storage = {
    getTodoList: () => get(TODO_KEY, []),
    saveTodoList: (list) => set(TODO_KEY, list),
    
    loadSoberDate: () => localStorage.getItem(SOBER_DATE_KEY) || '',
    saveSoberDate: (dateStr) => localStorage.setItem(SOBER_DATE_KEY, dateStr),

    getStepOneAnswers: (questions) => _getWorkbookAnswers(WORKBOOK_STEP1_KEY, questions),
    saveStepOneAnswers: (answers) => set(WORKBOOK_STEP1_KEY, answers),

    getStepTwoAnswers: (questions) => _getWorkbookAnswers(WORKBOOK_STEP2_KEY, questions),
    saveStepTwoAnswers: (answers) => set(WORKBOOK_STEP2_KEY, answers),

    getStepThreeAnswers: (questions) => _getWorkbookAnswers(WORKBOOK_STEP3_KEY, questions),
    saveStepThreeAnswers: (answers) => set(WORKBOOK_STEP3_KEY, answers),

    getStepFourAnswers: (questions) => _getWorkbookAnswers(WORKBOOK_STEP4_KEY, questions),
    saveStepFourAnswers: (answers) => set(WORKBOOK_STEP4_KEY, answers),

    // NEW: Functions for Step 5
    getStepFiveAnswers: (questions) => _getWorkbookAnswers(WORKBOOK_STEP5_KEY, questions),
    saveStepFiveAnswers: (answers) => set(WORKBOOK_STEP5_KEY, answers),
};

