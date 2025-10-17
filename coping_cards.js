// Imports for accessing data, storage, and shared utilities
import { AppData } from './data.js';
import { ViewManager } from './global_events.js';
import { deck } from './global_events.js'; // Import global deck reference

// --- Card Logic ---
export const CardLogic = {
    // Defines the bold color gradient for each card suit
    suitColor: (suit_key) => {
      switch(suit_key){
        case 'blue': return 'linear-gradient(135deg, #5B86E5 0%, #36D1DC 100%)'; // Action & Movement
        case 'green': return 'linear-gradient(135deg, #2ECC71 0%, #56C87C 100%)'; // Mind & Focus
        case 'orange': return 'linear-gradient(135deg, #C0392B 0%, #E74C3C 100%)'; // Connection & Support (Darker Red)
        case 'purple': return 'linear-gradient(135deg, #A569BD 0%, #D2B4DE 100%)'; // Creative & Learning
        default: return '#fff';
      }
    },
    
    // Updates the status text showing how many cards are left
    updateStatus: () => {
        document.getElementById('statusText').textContent = `Cards left in deck: ${deck.length} / 52`;
    },
    
    // Renders the card data onto the structured HTML elements
    renderCard: (card) => {
        // Set the subtle color background gradient
        document.getElementById('cardBackground').style.background = CardLogic.suitColor(card.suit_key);
        
        // Populate the top-left corner elements
        document.getElementById('cornerIcon').textContent = card.icon;
        document.getElementById('cornerSuit').textContent = card.suit;
        
        // Populate the main card text
        document.getElementById('cardText').textContent = card.text;
        
        CardLogic.updateStatus();
    },
    
    // Selects and removes a random card from the deck
    drawRandom: () => {
        if(deck.length === 0) return null;
        const idx = Math.floor(Math.random()*deck.length);
        const card = deck.splice(idx,1)[0];
        return card;
    },
    
    // Main function to draw a card and switch to the card view
    drawAndDisplayCard: () => {
        const card = CardLogic.drawRandom();
        if (!card) {
            console.log('Deck empty — no card to draw.');
            alert('Deck empty — please return home.');
            return;
        }
        CardLogic.renderCard(card);
        ViewManager.displayAppView('cardView');
    },
    
    // Resets the deck state and navigates back to the home screen
    resetDeck: () => {
        // Re-populate the deck with all cards
        deck.splice(0, deck.length, ...AppData.cards); 
        CardLogic.updateStatus();
        ViewManager.displayAppView('homeScreen');
    },

    // Binds the specific event listeners for the card view buttons
    bindEventListeners: () => {
        document.getElementById('goToCardsBtn').addEventListener('click', CardLogic.drawAndDisplayCard);
        document.getElementById('nextBtn').addEventListener('click', CardLogic.drawAndDisplayCard);
        document.getElementById('resetBtn').addEventListener('click', CardLogic.resetDeck);
    }
};
