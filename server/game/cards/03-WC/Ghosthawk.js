const Card = require('../../Card.js');

class Ghosthawk extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'reap with each of its neighbors in turn',
            target: {
                activePromptTitle: 'Choose a creature to reap with',
                cardCondition: (card, context) =>
                    !card.exhausted && context.source.neighbors.includes(card),
                gameAction: ability.actions.sequential([
                    ability.actions.reap(),
                    ability.actions.reap((context) => ({
                        target: context.target
                            ? context.source.neighbors.filter((c) => c !== context.target)
                            : []
                    }))
                ])
            }
        });
    }
}

Ghosthawk.id = 'ghosthawk';

module.exports = Ghosthawk;
