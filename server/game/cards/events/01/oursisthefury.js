const ChallengeEvent = require('../../challengeevent.js');

class OursIsTheFury extends ChallengeEvent {

    constructor(owner, cardData) {
        super(owner, cardData, null, 'defender');
    }

    play(player) {
        this.selectedCard = undefined;

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select character',
            source: this,
            cardCondition: card => card.kneeled && card.controller === this.controller && card.isFaction('baratheon'),
            onSelect: (player, cards) => this.onCardSelected(player, cards)
        });
    }

    afterChallenge(event, challenge) {
        if(!this.selectedCard) {
            return;
        }

        if(challenge.winner === this.controller) {
            this.controller.standCard(this.selectedCard);

            this.game.addMessage('{0} uses {1} to stand {2} as the challenge was won', this.controller, this, this.selectedCard);
        }

        this.selectedCard = undefined;
    }

    onCardSelected(player, card) {
        this.selectedCard = card;

        this.game.currentChallenge.addDefender(card);

        this.game.addMessage('{0} uses {1} to add {2} to the challenge as a defender', player, this, card);

        this.game.once('afterChallenge', this.afterChallenge.bind(this));

        return true;
    }
}

OursIsTheFury.code = '01063';

module.exports = OursIsTheFury;
