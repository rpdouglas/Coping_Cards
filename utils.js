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
        // Correct date parsing for cross-browser compatibility
        const date = new Date(dateKey.replace(/-/g, '\/'));
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },
    formatDateForDisplay: (dateKey) => {
        if (!dateKey) return '';
        const date = new Date(dateKey.replace(/-/g, '\/'));
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    },
    calculateDuration: (soberDateStr) => {
        if (!soberDateStr) return "Enter your date to start tracking!";
        
        const start = new Date(soberDateStr.replace(/-/g, '\/'));
        const now = new Date();
        
        if (start > now) return "Date must be in the past.";

        const diffTime = Math.abs(now - start);
        const MS_PER_DAY = 1000 * 60 * 60 * 24;
        const totalDays = Math.floor(diffTime / MS_PER_DAY);
        
        const years = Math.floor(totalDays / 365.25);
        const remainingDaysAfterYears = totalDays - Math.floor(years * 365.25);
        const months = Math.floor(remainingDaysAfterYears / 30.44);
        const days = remainingDaysAfterYears % 30.44;

        let output = "Sober for: ";
        if (years > 0) output += `${years} year${years !== 1 ? 's' : ''}, `;
        if (months > 0) output += `${months} month${months !== 1 ? 's' : ''}, and `;
        output += `${totalDays} total day${totalDays !== 1 ? 's' : ''}.`;
        
        return output;
    }
};

// --- View Management ---
export const ViewManager = {
    displayAppView: (viewId) => {
        const views = [
            'homeScreen', 'cardView', 'journalView', 
            'settingsView', 'todoView', 'literatureView', 'workbooksView', 
            'stepOneView', 'stepTwoView', 'stepThreeView', 'stepFourView', 
            'stepFiveView', 'stepSixView', 'stepSevenView', 'stepEightView',
            'stepNineView', 'stepTenView', 'stepElevenView', 'stepTwelveView',
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


