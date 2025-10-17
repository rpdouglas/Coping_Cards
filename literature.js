import { ViewManager } from './global_events.js'; 

export const LiteratureLogic = {
    /**
     * Shows the Recovery Literature page.
     * Content is static HTML within index.html.
     */
    showLiteratureView: () => {
        ViewManager.displayAppView('literatureView');
    },

    /**
     * Binds the event listener for the Literature Home button.
     */
    bindEventListeners: () => {
        document.getElementById('goToLiteratureBtn').addEventListener('click', LiteratureLogic.showLiteratureView);
        document.getElementById('literatureHomeBtn').addEventListener('click', () => ViewManager.displayAppView('homeScreen'));
    }
};
