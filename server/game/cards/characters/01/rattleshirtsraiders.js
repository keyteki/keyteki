const DrawCard = require('../../../drawcard.js');
 
class RattleshirtsRaiders extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    afterChallenge(challengeType, winner, loser, challenger) {
        if(!this.inPlay || challenger !== this.owner) {
            return;
        }

        if(winner !== this.owner) {
            return;
        }

        var buttons = [{ text: 'Done', command: 'plot', method: 'cancelSelect' }];

        this.game.promptForSelect(this.owner, this.onCardSelected.bind(this), 'Select attachment to discard', buttons);
    }

    cancelSelect(player) {
        if(!this.inPlay || this.owner !== player) {
            return;
        }

        this.game.cancelSelect(player);
    }

    onCardSelected(player, cardId) {
        if(!this.inPlay || this.owner !== player) {
            return false;
        }

        var otherPlayer = this.game.getOtherPlayer(player);
        if(!otherPlayer) {
            return false;
        }

        var card = player.findCardInPlayByUuid(cardId);
        
        if(!card) {
            card = otherPlayer.findCardInPlayByUuid(cardId);
        }
        if(!card || card.getType() !== 'attachment' || card.owner === this.owner) {
            return false;
        }

        card.parent.owner.discardCard(card);
        
        return true;
    }
}

RattleshirtsRaiders.code = '01030';

module.exports = RattleshirtsRaiders;
