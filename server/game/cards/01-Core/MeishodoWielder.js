const DrawCard = require('../../drawcard.js');

class MeishodoWielder extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: () => this.game.getFirstPlayer() === this.controller,
            targetType: 'player',
            effect: ability.effects.reduceCost({ playingTypes: 'play', match: card => card === this })
        });
    }
}

MeishodoWielder.id = 'meishodo-wielder';

module.exports = MeishodoWielder;
