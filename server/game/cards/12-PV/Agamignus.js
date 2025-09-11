const Card = require('../../Card.js');

class Agamignus extends Card {
    // After another Mutant creature enters play, gain 1A.
    // Fate: Destroy each non-Mutant creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.type === 'creature' &&
                    event.card.hasTrait('mutant') &&
                    event.card !== context.source
            },
            gameAction: ability.actions.gainAmber()
        });

        this.fate({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => !card.hasTrait('mutant'))
            }))
        });
    }
}

Agamignus.id = 'agamignus';

module.exports = Agamignus;
