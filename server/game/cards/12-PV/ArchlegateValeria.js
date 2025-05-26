const Card = require('../../Card.js');

class ArchlegateValeria extends Card {
    // Enhance .
    // Before Fight: Exalt an enemy creature for each of Archlegate Valeria's Saurian neighbors.
    setupCardAbilities(ability) {
        this.beforeFight({
            effect: 'exalt an enemy creature for each of its Saurian neighbors',
            gameAction: ability.actions.sequentialForEach((context) => ({
                num: context.source.neighbors.filter((card) => card.hasHouse('saurian')).length,
                action: ability.actions.exalt({
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature to exalt',
                        cardType: 'creature',
                        controller: 'opponent'
                    }
                })
            }))
        });
    }
}

ArchlegateValeria.id = 'archlegate-valeria';

module.exports = ArchlegateValeria;
