const PlotCard = require('../../../plotcard.js');

class WardensOfTheNorth extends PlotCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.menu.push({ text: 'Kneel a character to participate in the challenge', command: 'plot', method: 'selectCharacter' });
    }

    cardCondition(card) {
        return card.getFaction() === this.getFaction() && !card.kneeled;
    }

    doneSelect(player, card) {
        if(!this.inPlay) {
            return false;
        }

        player.addToChallenge(card);

        this.game.addMessage('{0} uses {1} to add {2} to the challenge', player, this, card);

        return true;
    }

    selectCharacter(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select card to kneel',
            waitingPromptTitle: 'Waiting for opponent',
            cardCondition: card => this.cardCondition(card),
            onSelect: (player, card) => this.doneSelect(player, card)
        });
    }
}

WardensOfTheNorth.code = '02062';

module.exports = WardensOfTheNorth;
