import { ViewManager, DateUtils } from './utils.js';
import { Storage } from './storage.js';

export const SettingsLogic = {
    showSettingsView: function() {
        ViewManager.displayAppView('settingsView');
        const savedDate = Storage.loadSoberDate();
        if (savedDate) {
            document.getElementById('soberDateInput').value = savedDate;
            document.getElementById('sobrietyDuration').textContent = DateUtils.calculateDuration(savedDate);
        }
    },

    bindEventListeners: function() {
        document.getElementById('settingsHomeBtn').addEventListener('click', () => ViewManager.displayAppView('homeScreen'));
        
        document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            const dateStr = document.getElementById('soberDateInput').value;
            if (dateStr && new Date(dateStr) <= new Date()) {
                Storage.saveSoberDate(dateStr);
                const durationText = DateUtils.calculateDuration(dateStr);
                document.getElementById('sobrietyDuration').textContent = durationText;
                document.getElementById('homeSobrietyDuration').textContent = durationText;
                alert('Sober Date Saved!');
            } else {
                alert('Please enter a valid Sober Date in the past.');
            }
        });
    }
};


