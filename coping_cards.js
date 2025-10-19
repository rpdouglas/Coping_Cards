import { AppData } from './data.js';
import { ViewManager } from './utils.js'; 
import { deck } from './state.js'; 

export const CardLogic = {
    suitColor: function(suit_key) {
        switch(suit_key){
            case 'blue': return 'linear-gradient(135deg, #5B86E5 0%, #36D1DC 100%)';
            case 'green': return 'linear-gradient(135deg, #2ECC71 0%, #56C87C 100%)';
            case 'orange': return 'linear-gradient(135deg, #C0392B 0%, #E74C3C 100%)';
            case 'purple': return 'linear-gradient(135deg, #A569BD 0%, #D2B4DE 100%)';
            default: return '#fff';
        }
    },
    updateStatus: function() {
        document.getElementById('statusText').textContent = `Cards left in deck: ${deck.length} / 52`;
    },
    renderCard: function(card) {
        document.getElementById('cardIcon').textContent = card.icon;
        document.getElementById('cardSuit').textContent = card.suit;
        document.getElementById('cardText').textContent = card.text;
        document.getElementById('cardArea').style.background = this.suitColor(card.suit_key);
        this.updateStatus();
    },
    drawRandom: function() {
        if(deck.length === 0) return null;
        const idx = Math.floor(Math.random()*deck.length);
        return deck.splice(idx,1)[0];
    },
    drawAndDisplayCard: function() {
        const card = this.drawRandom();
        if (!card) {
            alert('Deck empty — please shuffle or return home.');
            return;
        }
        this.renderCard(card);
        ViewManager.displayAppView('cardView');
    },
    resetDeck: function() {
        deck.splice(0, deck.length, ...AppData.cards);
        this.updateStatus();
        ViewManager.displayAppView('homeScreen');
    },
    bindEventListeners: function() {
        document.getElementById('nextBtn').addEventListener('click', this.drawAndDisplayCard.bind(this));
        document.getElementById('resetBtn').addEventListener('click', this.resetDeck.bind(this));
    }
};

