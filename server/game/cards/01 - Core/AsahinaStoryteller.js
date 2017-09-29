const DrawCard = require('../../drawcard.js');

class AsahinaStoryteller extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => true,
            match: card => card.getType() === 'character' && card.isHonored && card.isFaction('crane'),
            effect: ability.effects.addKeyword('sincerity')
        });
    }
}

AsahinaStoryteller.id = 'asahina-storyteller';

module.exports = AsahinaStoryteller;

