const ChallengeEvent = require('../../challengeevent.js');

class ForTheNorth extends ChallengeEvent {

    constructor(owner, cardData) {
        super(owner, cardData, 'military');
    }

    play(player) {
        this.selectedCard = undefined;

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select character',
            source: this,
            cardCondition: card =>
                this.game.currentChallenge.isParticipating(card)
                && card.isFaction('stark'),
            onSelect: (player, cards) => this.onCardSelected(player, cards)
        });
    }

    onCardSelected(player, card) {
        this.selectedCard = card;
        this.untilEndOfChallenge(ability => ({
            match: card,
            effect: ability.effects.modifyStrength(2)
        }));
        this.game.once('afterChallenge', this.afterChallenge.bind(this));

        this.game.addMessage('{0} uses {1} to give +2 STR to {2}',
                             player, this, card);

        return true;
    }

    afterChallenge(event, challenge) {
        if(!this.selectedCard) {
            return;
        }

        if(challenge.winner === this.controller) {
            this.controller.drawCardsToHand(1);

            this.game.addMessage('{0} uses {1} to draw 1 card',
                                 this.controller, this);
        }

        this.selectedCard = undefined;
    }
}

ForTheNorth.code = '01157';

module.exports = ForTheNorth;
