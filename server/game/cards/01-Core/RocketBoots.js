const Card = require('../../Card.js');

class RocketBoots extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.gainAbility('fight', {
                    condition: (context) =>
                        context.game.cardsUsed.filter((card) => card === context.source).length ===
                        1,
                    gameAction: ability.actions.ready()
                }),
                ability.effects.gainAbility('reap', {
                    condition: (context) =>
                        context.game.cardsUsed.filter((card) => card === context.source).length ===
                        1,
                    gameAction: ability.actions.ready()
                })
            ]
        });
    }
}

RocketBoots.id = 'rocket-boots';

module.exports = RocketBoots;
