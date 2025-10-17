import { ViewManager } from './global_events.js';
import { AppData } from './data.js';
import { Storage } from './storage.js';

/**
 * Workbook Logic Module (Steps 1-4)
 */

const WorkbookDataMap = {
    stepOne: { 
        questions: AppData.WORKBOOK_STEP1_QUESTIONS, 
        getAnswers: Storage.getStepOneAnswers, 
        saveAnswers: Storage.saveStepOneAnswers, 
        containerId: 'stepOneQuestions', 
        saveButtonId: 'saveStepOneBtn', 
        saveStatusId: 'stepOneSaveStatus',
        viewId: 'stepOneView'
    },
    stepTwo: { 
        questions: AppData.WORKBOOK_STEP2_QUESTIONS, 
        getAnswers: Storage.getStepTwoAnswers, 
        saveAnswers: Storage.saveStepTwoAnswers, 
        containerId: 'stepTwoQuestions', 
        saveButtonId: 'saveStepTwoBtn', 
        saveStatusId: 'stepTwoSaveStatus',
        viewId: 'stepTwoView'
    },
    stepThree: { 
        questions: AppData.WORKBOOK_STEP3_QUESTIONS, 
        getAnswers: Storage.getStepThreeAnswers, 
        saveAnswers: Storage.saveStepThreeAnswers, 
        containerId: 'stepThreeQuestions', 
        saveButtonId: 'saveStepThreeBtn', 
        saveStatusId: 'stepThreeSaveStatus',
        viewId: 'stepThreeView'
    },
    stepFour: { 
        questions: AppData.WORKBOOK_STEP4_QUESTIONS, 
        getAnswers: Storage.getStepFourAnswers, 
        saveAnswers: Storage.saveStepFourAnswers, 
        containerId: 'stepFourQuestions', 
        saveButtonId: 'saveStepFourBtn', 
        saveStatusId: 'stepFourSaveStatus',
        viewId: 'stepFourView'
    }
};

const toggleSection = (headerElement) => {
    const content = headerElement.nextElementSibling;
    const icon = headerElement.querySelector('.collapse-icon');
    content.classList.toggle('collapsed');
    headerElement.classList.toggle('collapsed');
};

const renderWorkbook = (config) => {
    const container = document.getElementById(config.containerId);
    container.innerHTML = '';
    // getAnswersFn needs the questions array for default answers
    const answers = config.getAnswers(config.questions); 
    let answerIndex = 0; 
    
    let currentSectionContent = null;
    let isFirstSection = true;
    
    config.questions.forEach((q) => {
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
            
            header.onclick = () => toggleSection(header);
            
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
    
    document.getElementById(config.saveStatusId).textContent = '';
    
    // Re-bind save listener 
    const saveBtn = document.getElementById(config.saveButtonId);
    if (saveBtn) {
        saveBtn.onclick = () => collectAndSaveWorkbookAnswers(config);
    }
};

const collectAndSaveWorkbookAnswers = (config) => {
    const textareas = document.querySelectorAll(`#${config.containerId} textarea`);
    
    // Pass questions to getAnswersFn so it can ensure the array length is correct
    let answers = config.getAnswers(config.questions); 
    
    textareas.forEach(textarea => {
        const index = parseInt(textarea.getAttribute('data-question-index'));
        if (index >= 0 && index < answers.length) {
            answers[index] = textarea.value;
        }
    });

    config.saveAnswers(answers);
    document.getElementById(config.saveStatusId).textContent = 'Progress Saved!';
    
    setTimeout(() => {
        document.getElementById(config.saveStatusId).textContent = '';
    }, 3000);
};


export const WorkbookLogic = {
    showWorkbooksHome: () => {
        ViewManager.displayAppView('workbooksView');
    },

    showStepOneView: () => {
        ViewManager.displayAppView(WorkbookDataMap.stepOne.viewId);
        renderWorkbook(WorkbookDataMap.stepOne);
    },
    showStepTwoView: () => {
        ViewManager.displayAppView(WorkbookDataMap.stepTwo.viewId);
        renderWorkbook(WorkbookDataMap.stepTwo);
    },
    showStepThreeView: () => {
        ViewManager.displayAppView(WorkbookDataMap.stepThree.viewId);
        renderWorkbook(WorkbookDataMap.stepThree);
    },
    showStepFourView: () => {
        ViewManager.displayAppView(WorkbookDataMap.stepFour.viewId);
        renderWorkbook(WorkbookDataMap.stepFour);
    },

    bindEventListeners: () => {
        // Navigational Buttons
        document.getElementById('goToWorkbooksBtn').addEventListener('click', WorkbookLogic.showWorkbooksHome);
        document.getElementById('workbooksHomeBtn').addEventListener('click', () => ViewManager.displayAppView('homeScreen'));
        document.getElementById('stepOneWorkbooksBtn').addEventListener('click', WorkbookLogic.showWorkbooksHome);
        document.getElementById('stepTwoWorkbooksBtn').addEventListener('click', WorkbookLogic.showWorkbooksHome);
        document.getElementById('stepThreeWorkbooksBtn').addEventListener('click', WorkbookLogic.showWorkbooksHome);
        document.getElementById('stepFourWorkbooksBtn').addEventListener('click', WorkbookLogic.showWorkbooksHome);

        // Step View Buttons
        document.getElementById('goToStep1Btn').addEventListener('click', WorkbookLogic.showStepOneView);
        document.getElementById('goToStep2Btn').addEventListener('click', WorkbookLogic.showStepTwoView);
        document.getElementById('goToStep3Btn').addEventListener('click', WorkbookLogic.showStepThreeView);
        document.getElementById('goToStep4Btn').addEventListener('click', WorkbookLogic.showStepFourView);

        // Save Buttons are bound dynamically within renderWorkbook, but we can bind the initial handlers here
        document.getElementById('saveStepOneBtn').addEventListener('click', () => collectAndSaveWorkbookAnswers(WorkbookDataMap.stepOne));
        document.getElementById('saveStepTwoBtn').addEventListener('click', () => collectAndSaveWorkbookAnswers(WorkbookDataMap.stepTwo));
        document.getElementById('saveStepThreeBtn').addEventListener('click', () => collectAndSaveWorkbookAnswers(WorkbookDataMap.stepThree));
        document.getElementById('saveStepFourBtn').addEventListener('click', () => collectAndSaveWorkbookAnswers(WorkbookDataMap.stepFour));
    }
};
