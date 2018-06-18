const ProvinceCard = require('../../provincecard.js');

class SecretCache extends ProvinceCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Look at top 5 cards',
            when: {
                onConflictDeclared: (event, context) => event.conflict.conflictProvince === context.source
            },
            effect: 'look at the top 5 cards of their conflict deck',
            gameAction: ability.actions.deckSearch({ amount: 5, reveal: false })
        });
    }
}

SecretCache.id = 'secret-cache';

module.exports = SecretCache;
