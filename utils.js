/**
 * NEW: Utility Module
 * Contains shared helper functions (DateUtils, ViewManager) to avoid circular dependencies.
 */

// --- Date/Time Helpers ---
export const DateUtils = {
    getFormattedDate: (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    },
    formatDateForDisplayShort: (dateKey) => {
        if (!dateKey) return '';
        const date = new Date(dateKey);
        return date.toLocaleDateString('en-US'); 
    },
    formatDateForDisplay: (dateKey) => {
        const parts = dateKey.split('-');
        if (parts.length === 3) {
            // Adjust for timezone offset by using UTC
            const date = new Date(parts[0], parts[1] - 1, parts[2]);
            return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
        }
        return dateKey;
    }
};

// --- View Management ---
export const ViewManager = {
    displayAppView: (viewId) => {
        const views = ['homeScreen', 'cardIntro', 'cardView', 'journalView', 'settingsView', 'todoView', 'literatureView', 'workbooksView', 'stepOneView', 'stepTwoView', 'stepThreeView', 'stepFourView', 'reflectionView', 'jftView'];
        views.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = id === viewId ? 'block' : 'none';
            }
        });
    }
};

