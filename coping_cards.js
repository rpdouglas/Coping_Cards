import { AppData } from './data.js';
import { ViewManager } from './utils.js'; 
// FIX: Import the shared 'deck' state from the new state.js file
import { deck } from './state.js'; 

// --- Card Logic ---
export const CardLogic = {
    suitColor: (suit_key) => {
        switch(suit_key){
            case 'blue': return 'linear-gradient(135deg, #5B86E5 0%, #36D1DC 100%)';
            case 'green': return 'linear-gradient(135deg, #2ECC71 0%, #56C87C 100%)';
            case 'orange': return 'linear-gradient(135deg, #C0392B 0%, #E74C3C 100%)';
            case 'purple': return 'linear-gradient(135deg, #A569BD 0%, #D2B4DE 100%)';
            default: return '#fff';
        }
    },
    updateStatus: () => {
        document.getElementById('statusText').textContent = `Cards left in deck: ${deck.length} / 52`;
    },
    renderCard: (card) => {
        document.getElementById('cardIcon').textContent = card.icon;
        document.getElementById('cardSuit').textContent = card.suit;
        document.getElementById('cardText').textContent = card.text;
        document.getElementById('cardArea').style.background = CardLogic.suitColor(card.suit_key);
        CardLogic.updateStatus();
    },
    drawRandom: () => {
        if(deck.length === 0) return null;
        const idx = Math.floor(Math.random()*deck.length);
        return deck.splice(idx,1)[0];
    },
    drawAndDisplayCard: () => {
        const card = CardLogic.drawRandom();
        if (!card) {
            alert('Deck empty — please shuffle or return home.');
            return;
        }
        CardLogic.renderCard(card);
        ViewManager.displayAppView('cardView');
    },
    resetDeck: () => {
        deck.splice(0, deck.length, ...AppData.cards);
        CardLogic.updateStatus();
        ViewManager.displayAppView('homeScreen');
    },
    bindEventListeners: () => {
        // These buttons are now handled in the main global_events.js file to centralize navigation
        // document.getElementById('goToCardsBtn').addEventListener('click', CardLogic.drawAndDisplayCard);
        document.getElementById('nextBtn').addEventListener('click', CardLogic.drawAndDisplayCard);
        document.getElementById('resetBtn').addEventListener('click', CardLogic.resetDeck);
    }
};


