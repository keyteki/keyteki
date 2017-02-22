const DrawCard = require('../../../drawcard.js');

class SerRodrikCassel extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'military' &&
                this.game.currentChallenge.isAttacking(this)
            ),
            match: card => card.isUnique() && card.isFaction('stark'),
            effect: ability.effects.addKeyword('Insight')
        });
    }
}

SerRodrikCassel.code = '02041';

module.exports = SerRodrikCassel;
