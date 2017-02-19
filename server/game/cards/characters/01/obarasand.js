const DrawCard = require('../../../drawcard.js');

class ObaraSand extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'power' &&
                this.game.currentChallenge.defendingPlayer === this.controller
            ),
            match: this,
            effect: [
                // Add the icon as a UI hint, but Obara can be declared even if
                // the opponent removes that icon somehow.
                ability.effects.addIcon('power'),
                ability.effects.canBeDeclaredWithoutIcon(),
                ability.effects.canBeDeclaredWhileKneeling()
            ]
        });
    }
}

ObaraSand.code = '01108';

module.exports = ObaraSand;
