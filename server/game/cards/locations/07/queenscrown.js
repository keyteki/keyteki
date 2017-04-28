const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class Queenscrown extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal top 3 cards of opponent\'s deck',
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let opponent = this.game.getOtherPlayer(this.controller);

                if(!opponent) {
                    return;
                }

                this.remainingCards = opponent.drawDeck.first(3);
                this.game.addMessage('{0} kneels {1} to reveal {2} from the top of {3}\'s deck', this.controller, this, this.remainingCards, opponent);

                let characters = _.filter(this.remainingCards, card => card.getType() === 'character');
                if(characters.length > 0) {
                    this.promptToDiscardCharacter(characters);
                } else {
                    this.promptToPlaceOnBottom();
                }
            }
        });
    }

    promptToDiscardCharacter(characters) {
        let buttons = _.map(characters, card => {
            return { method: 'placeCharacterInDiscard', card: card };
        });
        buttons.push({ text: 'Done', method: 'promptToPlaceOnBottom' });
        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Place a character in discard?',
                buttons: buttons
            },
            source: this
        });
    }

    placeCharacterInDiscard(player, cardId) {
        let card = _.find(this.remainingCards, card => card.uuid === cardId);
        card.controller.moveCard(card, 'discard pile');
        this.game.addMessage('{0} uses {1} to place {2} in {3}\'s discard pile', player, this, card, card.controller);
        this.remainingCards = _.reject(this.remainingCards, c => c === card);
        this.promptToPlaceOnBottom();
        return true;
    }

    promptToPlaceOnBottom() {
        if(this.remainingCards.length === 0) {
            return;
        }

        if(this.remainingCards.length === 1) {
            let card = this.remainingCards.shift();
            card.controller.moveCard(card, 'draw deck', { bottom: true });
            this.game.addMessage('{0} has placed the remaining cards at the bottom of {1}\'s deck', this.controller, card.controller);
            return;
        }

        let buttons = _.map(this.remainingCards, card => {
            return { method: 'placeCardOnBottom', card: card };
        });

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Choose card to place on bottom of deck',
                buttons: buttons
            },
            source: this
        });
        return true;
    }

    placeCardOnBottom(player, cardId) {
        let card = _.find(this.remainingCards, card => card.uuid === cardId);

        if(!card) {
            return false;
        }

        card.controller.moveCard(card, 'draw deck', { bottom: true });
        this.remainingCards = _.reject(this.remainingCards, c => c === card);
        this.promptToPlaceOnBottom();
        return true;
    }
}

Queenscrown.code = '07019';

module.exports = Queenscrown;
