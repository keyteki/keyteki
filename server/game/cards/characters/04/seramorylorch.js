const DrawCard = require('../../../drawcard.js');

class SerAmoryLorch extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.opponentHasThreeOrFewerChars(),
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });
    }

    opponentHasThreeOrFewerChars() {
        var otherPlayer = this.game.getOtherPlayer(this.controller);

        if(!otherPlayer) {
            return true;
        }

        return otherPlayer.getNumberOfCardsInPlay(card => card.getType() === 'character') <= 3;
    }
}

SerAmoryLorch.code = '04049';

module.exports = SerAmoryLorch;
