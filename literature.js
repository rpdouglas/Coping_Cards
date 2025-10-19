import { ViewManager } from './utils.js'; 

export const LiteratureLogic = {
    showLiteratureView: function() {
        ViewManager.displayAppView('literatureView');
    },
    
    bindEventListeners: function() {
        // Binds only the buttons within the literature view itself.
        document.getElementById('literatureHomeBtn').addEventListener('click', () => ViewManager.displayAppView('homeScreen'));
    }
};


