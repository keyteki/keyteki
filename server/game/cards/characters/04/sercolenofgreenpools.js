const DrawCard = require('../../../drawcard.js');

class SerColenOfGreenpools extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.challengeType === 'power',
            match: this,
            effect: ability.effects.modifyStrength(3)
        });
    }
}

SerColenOfGreenpools.code = '04004';

module.exports = SerColenOfGreenpools;
