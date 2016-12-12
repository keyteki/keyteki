const DrawCard = require('../../../drawcard.js');

class RattleshirtsRaiders extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    afterChallenge(e, challenge) {
        if(!this.inPlay || challenge.attackingPlayer !== this.controller) {
            return;
        }

        if(challenge.winner !== this.controller) {
            return;
        }

        if(!challenge.attackingPlayer.cardsInChallenge.contains(this)) {
            return;
        }

        this.game.promptForSelect(this.controller, {
            activePromptTitle: 'Select attachment to discard',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.inPlay && card.controller === challenge.loser && card.getType() === 'attachment',
            onSelect: (p, card) => this.onCardSelected(p, card)
        });
    }

    onCardSelected(player, card) {
        card.owner.discardCard(card);

        return true;
    }
}

RattleshirtsRaiders.code = '01030';

module.exports = RattleshirtsRaiders;
