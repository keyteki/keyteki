const DrawCard = require('../../../drawcard.js');

class KingsHuntingParty extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: this.effectCondition.bind(this),
            match: this,
            effect: ability.effects.addIcon('intrigue')
        });
    }

    effectCondition() {
        var otherPlayer = this.game.getOtherPlayer(this.controller);
        if(!otherPlayer || this.controller.phase === 'setup') {
            return false;
        }

        if(otherPlayer.anyCardsInPlay(card => {
            return card.getType() === 'character' && card.hasTrait('King');
        })) {
            return true;
        }

        return false;
    }
}

KingsHuntingParty.code = '01055';

module.exports = KingsHuntingParty;
