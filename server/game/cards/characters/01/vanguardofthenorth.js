const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class VanguardOfTheNorth extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'military' &&
                _.any(this.game.getPlayers(), player => player.activePlot && player.activePlot.hasTrait('War'))
            ),
            match: this,
            effect: ability.effects.doesNotKneelAsAttacker()
        });
    }
}

VanguardOfTheNorth.code = '01151';

module.exports = VanguardOfTheNorth;
