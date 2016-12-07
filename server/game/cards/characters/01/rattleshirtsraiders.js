const DrawCard = require('../../../drawcard.js');
 
class RattleshirtsRaiders extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    afterChallenge(e, challengeType, winner, loser, challenger) {
        if(!this.inPlay || challenger !== this.owner) {
            return;
        }

        if(winner !== this.owner) {
            return;
        }

        if(!challenger.cardsInChallenge.contains(this)) {
            return;
        }

        this.game.promptForSelect(this.owner, {
            activePromptTitle: 'Select attachment to discard',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.inPlay && card.owner === loser && card.getType() === 'attachment',
            onSelect: (p, card) => this.onCardSelected(p, card)
        });
    }

    onCardSelected(player, card) {
        card.parent.owner.discardCard(card);
        
        return true;
    }
}

RattleshirtsRaiders.code = '01030';

module.exports = RattleshirtsRaiders;
