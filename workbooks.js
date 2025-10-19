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
    },
    stepSix: {
        questions: AppData.WORKBOOK_STEP6_QUESTIONS,
        getAnswers: Storage.getStepSixAnswers,
        saveAnswers: Storage.saveStepSixAnswers,
        containerId: 'stepSixQuestions',
        saveStatusId: 'stepSixSaveStatus',
        viewId: 'stepSixView'
    },
    stepSeven: {
        questions: AppData.WORKBOOK_STEP7_QUESTIONS,
        getAnswers: Storage.getStepSevenAnswers,
        saveAnswers: Storage.saveStepSevenAnswers,
        containerId: 'stepSevenQuestions',
        saveStatusId: 'stepSevenSaveStatus',
        viewId: 'stepSevenView'
    },
    stepEight: {
        questions: AppData.WORKBOOK_STEP8_QUESTIONS,
        getAnswers: Storage.getStepEightAnswers,
        saveAnswers: Storage.saveStepEightAnswers,
        containerId: 'stepEightQuestions',
        saveStatusId: 'stepEightSaveStatus',
        viewId: 'stepEightView'
    },
    stepNine: {
        questions: AppData.WORKBOOK_STEP9_QUESTIONS,
        getAnswers: Storage.getStepNineAnswers,
        saveAnswers: Storage.saveStepNineAnswers,
        containerId: 'stepNineQuestions',
        saveStatusId: 'stepNineSaveStatus',
        viewId: 'stepNineView'
    },
    stepTen: {
        questions: AppData.WORKBOOK_STEP10_QUESTIONS,
        getAnswers: Storage.getStepTenAnswers,
        saveAnswers: Storage.saveStepTenAnswers,
        containerId: 'stepTenQuestions',
        saveStatusId: 'stepTenSaveStatus',
        viewId: 'stepTenView'
    },
    stepEleven: {
        questions: AppData.WORKBOOK_STEP11_QUESTIONS,
        getAnswers: Storage.getStepElevenAnswers,
        saveAnswers: Storage.saveStepElevenAnswers,
        containerId: 'stepElevenQuestions',
        saveStatusId: 'stepElevenSaveStatus',
        viewId: 'stepElevenView'
    },
    stepTwelve: {
        questions: AppData.WORKBOOK_STEP12_QUESTIONS,
        getAnswers: Storage.getStepTwelveAnswers,
        saveAnswers: Storage.saveStepTwelveAnswers,
        containerId: 'stepTwelveQuestions',
        saveStatusId: 'stepTwelveSaveStatus',
        viewId: 'stepTwelveView'
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
    showStepSixView: function() { ViewManager.displayAppView(WorkbookDataMap.stepSix.viewId); renderWorkbook(WorkbookDataMap.stepSix); },
    showStepSevenView: function() { ViewManager.displayAppView(WorkbookDataMap.stepSeven.viewId); renderWorkbook(WorkbookDataMap.stepSeven); },
    showStepEightView: function() { ViewManager.displayAppView(WorkbookDataMap.stepEight.viewId); renderWorkbook(WorkbookDataMap.stepEight); },
    showStepNineView: function() { ViewManager.displayAppView(WorkbookDataMap.stepNine.viewId); renderWorkbook(WorkbookDataMap.stepNine); },
    showStepTenView: function() { ViewManager.displayAppView(WorkbookDataMap.stepTen.viewId); renderWorkbook(WorkbookDataMap.stepTen); },
    showStepElevenView: function() { ViewManager.displayAppView(WorkbookDataMap.stepEleven.viewId); renderWorkbook(WorkbookDataMap.stepEleven); },
    showStepTwelveView: function() { ViewManager.displayAppView(WorkbookDataMap.stepTwelve.viewId); renderWorkbook(WorkbookDataMap.stepTwelve); },

    bindEventListeners: function() {
        document.getElementById('goToStep1Btn').addEventListener('click', this.showStepOneView.bind(this));
        document.getElementById('goToStep2Btn').addEventListener('click', this.showStepTwoView.bind(this));
        document.getElementById('goToStep3Btn').addEventListener('click', this.showStepThreeView.bind(this));
        document.getElementById('goToStep4Btn').addEventListener('click', this.showStepFourView.bind(this));
        document.getElementById('goToStep5Btn').addEventListener('click', this.showStepFiveView.bind(this));
        document.getElementById('goToStep6Btn').addEventListener('click', this.showStepSixView.bind(this));
        document.getElementById('goToStep7Btn').addEventListener('click', this.showStepSevenView.bind(this));
        document.getElementById('goToStep8Btn').addEventListener('click', this.showStepEightView.bind(this));
        document.getElementById('goToStep9Btn').addEventListener('click', this.showStepNineView.bind(this));
        document.getElementById('goToStep10Btn').addEventListener('click', this.showStepTenView.bind(this));
        document.getElementById('goToStep11Btn').addEventListener('click', this.showStepElevenView.bind(this));
        document.getElementById('goToStep12Btn').addEventListener('click', this.showStepTwelveView.bind(this));
        
        document.getElementById('workbooksHomeBtn').addEventListener('click', this.showWorkbooksHome.bind(this));
        document.getElementById('stepOneWorkbooksBtn').addEventListener('click', this.showWorkbooksHome.bind(this));
        document.getElementById('stepTwoWorkbooksBtn').addEventListener('click', this.showWorkbooksHome.bind(this));
        document.getElementById('stepThreeWorkbooksBtn').addEventListener('click', this.showWorkbooksHome.bind(this));
        document.getElementById('stepFourWorkbooksBtn').addEventListener('click', this.showWorkbooksHome.bind(this));
        document.getElementById('stepFiveWorkbooksBtn').addEventListener('click', this.showWorkbooksHome.bind(this));
        document.getElementById('stepSixWorkbooksBtn').addEventListener('click', this.showWorkbooksHome.bind(this));
        document.getElementById('stepSevenWorkbooksBtn').addEventListener('click', this.showWorkbooksHome.bind(this));
        document.getElementById('stepEightWorkbooksBtn').addEventListener('click', this.showWorkbooksHome.bind(this));
        document.getElementById('stepNineWorkbooksBtn').addEventListener('click', this.showWorkbooksHome.bind(this));
        document.getElementById('stepTenWorkbooksBtn').addEventListener('click', this.showWorkbooksHome.bind(this));
        document.getElementById('stepElevenWorkbooksBtn').addEventListener('click', this.showWorkbooksHome.bind(this));
        document.getElementById('stepTwelveWorkbooksBtn').addEventListener('click', this.showWorkbooksHome.bind(this));

        document.getElementById('saveStepOneBtn').addEventListener('click', () => collectAndSaveWorkbookAnswers(WorkbookDataMap.stepOne));
        document.getElementById('saveStepTwoBtn').addEventListener('click', () => collectAndSaveWorkbookAnswers(WorkbookDataMap.stepTwo));
        document.getElementById('saveStepThreeBtn').addEventListener('click', () => collectAndSaveWorkbookAnswers(WorkbookDataMap.stepThree));
        document.getElementById('saveStepFourBtn').addEventListener('click', () => collectAndSaveWorkbookAnswers(WorkbookDataMap.stepFour));
        document.getElementById('saveStepFiveBtn').addEventListener('click', () => collectAndSaveWorkbookAnswers(WorkbookDataMap.stepFive));
        document.getElementById('saveStepSixBtn').addEventListener('click', () => collectAndSaveWorkbookAnswers(WorkbookDataMap.stepSix));
        document.getElementById('saveStepSevenBtn').addEventListener('click', () => collectAndSaveWorkbookAnswers(WorkbookDataMap.stepSeven));
        document.getElementById('saveStepEightBtn').addEventListener('click', () => collectAndSaveWorkbookAnswers(WorkbookDataMap.stepEight));
        document.getElementById('saveStepNineBtn').addEventListener('click', () => collectAndSaveWorkbookAnswers(WorkbookDataMap.stepNine));
        document.getElementById('saveStepTenBtn').addEventListener('click', () => collectAndSaveWorkbookAnswers(WorkbookDataMap.stepTen));
        document.getElementById('saveStepElevenBtn').addEventListener('click', () => collectAndSaveWorkbookAnswers(WorkbookDataMap.stepEleven));
        document.getElementById('saveStepTwelveBtn').addEventListener('click', () => collectAndSaveWorkbookAnswers(WorkbookDataMap.stepTwelve));
    }
};


