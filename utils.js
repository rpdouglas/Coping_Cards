/**
 * Utility Module
 * Contains shared helper functions to avoid circular dependencies.
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
            const date = new Date(parts[0], parts[1] - 1, parts[2]);
            return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
        }
        return dateKey;
    },
    calculateDuration: (soberDateStr) => {
        if (!soberDateStr) return "Enter your date to start tracking!";
        const start = new Date(soberDateStr);
        const now = new Date();
        if (start > now) return "Date must be in the past.";
        const diffTime = Math.abs(now - start);
        const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const years = Math.floor(totalDays / 365.25);
        const remainingDaysAfterYears = totalDays % 365.25;
        const months = Math.floor(remainingDaysAfterYears / 30.44);
        let output = "Sober for: ";
        if (years > 0) output += `${years} year${years !== 1 ? 's' : ''}, `;
        if (months > 0) output += `${months} month${months !== 1 ? 's' : ''}, and `;
        output += `${totalDays} day${totalDays !== 1 ? 's' : ''} total.`;
        return output;
    }
};

// --- View Management ---
export const ViewManager = {
    displayAppView: (viewId) => {
        const views = [
            'homeScreen', 'cardIntro', 'cardView', 'journalView', 
            'settingsView', 'todoView', 'literatureView', 'workbooksView', 
            'stepOneView', 'stepTwoView', 'stepThreeView', 'stepFourView', 'stepFiveView', // NEW: Added stepFiveView
            'reflectionView', 'jftView'
        ];
        views.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = id === viewId ? 'block' : 'none';
            }
        });
    }
};


