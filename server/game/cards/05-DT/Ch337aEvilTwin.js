const Card = require('../../Card.js');

class Ch337aEvilTwin extends Card {
    //Skirmish.
    //While the tide is high, each of $this's neighbors gain Skirmish.
    setupCardAbilities(ability) {
        //Keywords: skirmish
        this.persistentEffect({
            targetController: 'any',
            condition: (context) => context.player.isTideHigh(),
            match: (card, context) =>
                card.type === 'creature' && context.source.neighbors.includes(card),
            effect: ability.effects.addKeyword({
                skirmish: 1
            })
        });
    }
}

Ch337aEvilTwin.id = 'ch-337a-evil-twin';

module.exports = Ch337aEvilTwin;
