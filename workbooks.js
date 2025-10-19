import { ViewManager } from './utils.js';
import { AppData } from './data.js';
import { Storage } from './storage.js';

// --- Private Helper Functions ---

const WorkbookDataMap = {
    stepOne: { 
        questions: AppData.WORKBOOK_STEP1_QUESTIONS, 
        getAnswers: Storage.getStepOneAnswers, 
        saveAnswers: Storage.saveStepOneAnswers, 
        containerId: 'stepOneQuestions', 
        saveStatusId: 'stepOneSaveStatus',
        viewId: 'stepOneView'
    },
    stepTwo: { 
        questions: AppData.WORKBOOK_STEP2_QUESTIONS, 
        getAnswers: Storage.getStepTwoAnswers, 
        saveAnswers: Storage.saveStepTwoAnswers, 
        containerId: 'stepTwoQuestions', 
        saveStatusId: 'stepTwoSaveStatus',
        viewId: 'stepTwoView'
    },
    stepThree: { 
        questions: AppData.WORKBOOK_STEP3_QUESTIONS, 
        getAnswers: Storage.getStepThreeAnswers, 
        saveAnswers: Storage.saveStepThreeAnswers, 
        containerId: 'stepThreeQuestions', 
        saveStatusId: 'stepThreeSaveStatus',
        viewId: 'stepThreeView'
    },
    stepFour: { 
        questions: AppData.WORKBOOK_STEP4_QUESTIONS, 
        getAnswers: Storage.getStepFourAnswers, 
        saveAnswers: Storage.saveStepFourAnswers, 
        containerId: 'stepFourQuestions', 
        saveStatusId: 'stepFourSaveStatus',
        viewId: 'stepFourView'
    },
    stepFive: {
        questions: AppData.WORKBOOK_STEP5_QUESTIONS,
        getAnswers: Storage.getStepFiveAnswers,
        saveAnswers: Storage.saveStepFiveAnswers,
        containerId: 'stepFiveQuestions',
        saveStatusId: 'stepFiveSaveStatus',
        viewId: 'stepFiveView'
    }
};

const toggleSection = (headerElement) => {
    const content = headerElement.nextElementSibling;
    headerElement.classList.toggle('collapsed');
    content.classList.toggle('collapsed');
};

const renderWorkbook = (config) => {
    const container = document.getElementById(config.containerId);
    container.innerHTML = '';
    const answers = config.getAnswers(config.questions); 
    let answerIndex = 0; 
    let currentSectionContent = null;
    let isFirstSection = true;
    
    config.questions.forEach((q) => {
        if (q.isSection) {
            if (currentSectionContent) container.appendChild(currentSectionContent);
            const header = document.createElement('div');
            header.className = 'workbook-section-header';
            if (!isFirstSection) header.classList.add('collapsed');
            header.innerHTML = `<h3>${q.title}</h3><span class="collapse-icon">▼</span>`;
            header.onclick = () => toggleSection(header);
            
            currentSectionContent = document.createElement('div');
            currentSectionContent.className = 'section-content';
            if (!isFirstSection) currentSectionContent.classList.add('collapsed');
            
            container.appendChild(header);
            isFirstSection = false;
        } else if (currentSectionContent) {
            const div = document.createElement('div');
            div.className = 'workbook-question';
            const h4 = document.createElement('h4');
            h4.textContent = `${answerIndex + 1}. ${q}`;
            const textarea = document.createElement('textarea');
            textarea.dataset.questionIndex = answerIndex;
            textarea.value = answers[answerIndex] || ''; 
            textarea.placeholder = 'Write your honest answer here...';
            div.append(h4, textarea);
            currentSectionContent.appendChild(div);
            answerIndex++; 
        }
    });
    
    if (currentSectionContent) container.appendChild(currentSectionContent);
    document.getElementById(config.saveStatusId).textContent = '';
};

const collectAndSaveWorkbookAnswers = (config) => {
    const textareas = document.querySelectorAll(`#${config.containerId} textarea`);
    let answers = config.getAnswers(config.questions); 
    textareas.forEach(textarea => {
        const index = parseInt(textarea.dataset.questionIndex);
        if (!isNaN(index) && index < answers.length) {
            answers[index] = textarea.value;
        }
    });
    config.saveAnswers(answers);
    const statusEl = document.getElementById(config.saveStatusId);
    statusEl.textContent = 'Progress Saved!';
    setTimeout(() => { statusEl.textContent = ''; }, 3000);
};

// --- Exported Logic Module ---
export const WorkbookLogic = {
    showWorkbooksHome: function() { ViewManager.displayAppView('workbooksView'); },
    showStepOneView: function() { ViewManager.displayAppView(WorkbookDataMap.stepOne.viewId); renderWorkbook(WorkbookDataMap.stepOne); },
    showStepTwoView: function() { ViewManager.displayAppView(WorkbookDataMap.stepTwo.viewId); renderWorkbook(WorkbookDataMap.stepTwo); },
    showStepThreeView: function() { ViewManager.displayAppView(WorkbookDataMap.stepThree.viewId); renderWorkbook(WorkbookDataMap.stepThree); },
    showStepFourView: function() { ViewManager.displayAppView(WorkbookDataMap.stepFour.viewId); renderWorkbook(WorkbookDataMap.stepFour); },
    showStepFiveView: function() { ViewManager.displayAppView(WorkbookDataMap.stepFive.viewId); renderWorkbook(WorkbookDataMap.stepFive); },

    bindEventListeners: function() {
        document.getElementById('goToStep1Btn').addEventListener('click', this.showStepOneView.bind(this));
        document.getElementById('goToStep2Btn').addEventListener('click', this.showStepTwoView.bind(this));
        document.getElementById('goToStep3Btn').addEventListener('click', this.showStepThreeView.bind(this));
        document.getElementById('goToStep4Btn').addEventListener('click', this.showStepFourView.bind(this));
        document.getElementById('goToStep5Btn').addEventListener('click', this.showStepFiveView.bind(this));
        
        document.getElementById('workbooksHomeBtn').addEventListener('click', this.showWorkbooksHome.bind(this));
        document.getElementById('stepOneWorkbooksBtn').addEventListener('click', this.showWorkbooksHome.bind(this));
        document.getElementById('stepTwoWorkbooksBtn').addEventListener('click', this.showWorkbooksHome.bind(this));
        document.getElementById('stepThreeWorkbooksBtn').addEventListener('click', this.showWorkbooksHome.bind(this));
        document.getElementById('stepFourWorkbooksBtn').addEventListener('click', this.showWorkbooksHome.bind(this));
        document.getElementById('stepFiveWorkbooksBtn').addEventListener('click', this.showWorkbooksHome.bind(this));

        document.getElementById('saveStepOneBtn').addEventListener('click', () => collectAndSaveWorkbookAnswers(WorkbookDataMap.stepOne));
        document.getElementById('saveStepTwoBtn').addEventListener('click', () => collectAndSaveWorkbookAnswers(WorkbookDataMap.stepTwo));
        document.getElementById('saveStepThreeBtn').addEventListener('click', () => collectAndSaveWorkbookAnswers(WorkbookDataMap.stepThree));
        document.getElementById('saveStepFourBtn').addEventListener('click', () => collectAndSaveWorkbookAnswers(WorkbookDataMap.stepFour));
        document.getElementById('saveStepFiveBtn').addEventListener('click', () => collectAndSaveWorkbookAnswers(WorkbookDataMap.stepFive));
    }
};

