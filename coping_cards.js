import { AppData } from './data.js';
import { ViewManager } from './global_events.js'; // Import ViewManager for screen transitions
import { deck } from './global_events.js'; // Import deck state (mutable)

// ----------------------------------------------------------------------
// Card Logic Module
// ----------------------------------------------------------------------

const CardLogic = {
    /**
     * Defines the color gradient for each card suit.
     * @param {string} suit_key 
     * @returns {string} CSS linear gradient value.
     */
    suitColor: (suit_key) => {
        switch(suit_key){
            case 'blue': return 'linear-gradient(135deg, #5B86E5 0%, #36D1DC 100%)';
            case 'green': return 'linear-gradient(135deg, #2ECC71 0%, #56C87C 100%)';
            case 'orange': return 'linear-gradient(135deg, #C0392B 0%, #E74C3C 100%)'; // Darker Red Gradient
            case 'purple': return 'linear-gradient(135deg, #A569BD 0%, #D2B4DE 100%)';
            default: return '#fff';
        }
    },
    
    /**
     * Updates the status text showing cards remaining.
     */
    updateStatus: () => {
        document.getElementById('statusText').textContent = `Cards left in deck: ${deck.length} / ${AppData.cards.length}`;
    },

    /**
     * Renders a single card object onto the card view screen.
     * @param {object} card 
     */
    renderCard: (card) => {
        // Render top-left corner
        document.getElementById('cornerIcon').textContent = card.icon;
        document.getElementById('cornerSuit').textContent = card.suit;
        
        // Render main content
        document.getElementById('cardText').textContent = card.text;
        
        // Set subtle background color/gradient
        document.getElementById('cardBackground').style.background = CardLogic.suitColor(card.suit_key);
        
        CardLogic.updateStatus();
    },

    /**
     * Draws a random card from the available deck and removes it.
     * @returns {object|null} The drawn card or null if the deck is empty.
     */
    drawRandom: () => {
        if(deck.length === 0) return null;
        const idx = Math.floor(Math.random() * deck.length);
        // NOTE: Uses global deck state defined in global_events.js
        const card = deck.splice(idx,1)[0];
        return card;
    },
    
    /**
     * Draws a card and displays the card view. Used for homepage button and 'Next Card'.
     */
    drawAndDisplayCard: () => {
        const card = CardLogic.drawRandom();
        if (!card) {
            console.log('Deck empty — shuffle or reset.');
            alert('Deck empty — please draw a new deck by going Home.');
            return;
        }
        CardLogic.renderCard(card);
        ViewManager.displayAppView('cardView');
    },

    /**
     * Resets the deck and returns to the home screen.
     */
    resetDeck: () => {
        // Reset global deck state
        deck.length = 0; // Clear the array first
        deck.push(...AppData.cards); // Push all new cards back in
        CardLogic.updateStatus();
        ViewManager.displayAppView('homeScreen');
    },

    /**
     * Binds event listeners for buttons specific to the card view.
     * NOTE: This is no longer called by global_events.js, as main card buttons are bound there directly.
     */
    bindEventListeners: () => {
        // These listeners are now bound in global_events.js directly for robustness, 
        // but kept here for completeness in the module scope.
    }
};

export { CardLogic };
