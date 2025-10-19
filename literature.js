// UPDATED: Import from the new utils.js file
import { ViewManager } from './utils.js'; 

export const LiteratureLogic = {
    showLiteratureView: () => {
        ViewManager.displayAppView('literatureView');
    },
    bindEventListeners: () => {
        document.getElementById('goToLiteratureBtn').addEventListener('click', LiteratureLogic.showLiteratureView);
        document.getElementById('literatureHomeBtn').addEventListener('click', () => ViewManager.displayAppView('homeScreen'));
    }
};

