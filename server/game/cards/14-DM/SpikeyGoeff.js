const Card = require('../../Card.js');

class SpikeyGoeff extends Card {
    // Taunt.
    // If you are overwhelmed, Spikey Goeff gains hazardous 2.
    // Scrap: Deal 2 to a creature.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.controller.isOverwhelmed(),
            match: (card, context) => card === context.source,
            effect: ability.effects.addKeyword({ hazardous: 2 })
        });

        this.scrap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            }
        });
    }
}

SpikeyGoeff.id = 'spikey-goeff';

module.exports = SpikeyGoeff;
