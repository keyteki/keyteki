const DrawCard = require('../../../drawcard.js');

class EddardStark extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onRenown']);
    }

    onRenown(event, challenge, card) {
        var player = challenge.winner;
        if(!this.inPlay || this.isBlank() || this.controller !== player || card !== this) {
            return;
        }

        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select character to gain power',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    cardCondition(card) {
        if(card.getType() !== 'character') {
            return false;
        }

        if(!this.controller.cardsInChallenge.find(c => {
            return c.uuid !== this.uuid && c.uuid === card.uuid;
        })) {
            return false;
        }

        return true;
    }

    onCardSelected(player, card) {
        if(!this.inPlay || this.isBlank() || this.controller !== player) {
            return;
        }

        card.power++;

        this.game.addMessage('{0} uses {1} to allow {2} to gain 1 power', player, this, card);

        return true;
    }
}

EddardStark.code = '03003';

module.exports = EddardStark;
