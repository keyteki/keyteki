const _ = require('underscore');
const DrawCard = require('../../../drawcard.js');

class MyrcellaBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.areNoKingsInPlay() &&
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'power'),
            match: this,
            effect: ability.effects.doesNotKneelAsDefender()
        });

        this.persistentEffect({
            condition: () => this.areNoKingsInPlay(),
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });
    }

    areNoKingsInPlay() {
        return !_.any(this.game.getPlayers(), player => {
            return player.anyCardsInPlay(card => card.getType() === 'character' && card.hasTrait('King'));
        });
    }
}

MyrcellaBaratheon.code = '04095';

module.exports = MyrcellaBaratheon;
