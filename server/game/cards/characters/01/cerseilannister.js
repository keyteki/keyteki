const DrawCard = require('../../../drawcard.js');

class CerseiLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'intrigue' &&
                this.game.currentChallenge.isAttacking(this)
            ),
            match: card => card === this.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
    }
}

CerseiLannister.code = '01084';

module.exports = CerseiLannister;
