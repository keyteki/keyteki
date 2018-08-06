const DrawCard = require('../../drawcard.js');

class YasukiBroker extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.persistentEffect({
            condition: () => this.isParticipating(),
            match: card => card.getType() === 'character',
            effect: [
                ability.effects.addKeyword('courtesy'),
                ability.effects.addKeyword('sincerity')
            ]
        });
    }
}

YasukiBroker.id = 'yasuki-broker'; // This is a guess at what the id might be - please check it!!!

module.exports = YasukiBroker;
