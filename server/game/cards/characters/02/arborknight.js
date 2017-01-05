const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class ArborKnight extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.cardsAffected = [];
    }

    setupCardAbilities() {
        this.action({
            title: 'Pay 1 gold to give a character +1 STR',
            method: 'payGold',
            limit: { amount: 3, period: 'phase' }
        });
    }

    payGold(player) {
        if(this.controller !== player || player.gold < 1 || !this.game.currentChallenge) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.hasTrait('House Redwyne') && this.game.currentChallenge.isParticipating(card),
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        if(!this.registeredEvent) {
            this.game.once('onChallengeFinished', this.onChallengeFinished.bind(this));

            this.registeredEvent = true;
        }

        return true;
    }

    onCardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to pay 1 gold and give {2} +1 STR until the end of the challenge', player, this, card);

        card.strengthModifier++;

        this.cardsAffected.push(card);
        
        player.gold -= 1;

        return true;
    }

    onChallengeFinished() {
        this.registeredEvent = false;
        
        _.each(this.cardsAffected, card => {
            card.strengthModifier--;
        });

        this.cardsAffected = [];
    }
}

ArborKnight.code = '02005';

module.exports = ArborKnight;
