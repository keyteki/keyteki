const Card = require('../../Card.js');

class T3r35a extends Card {
    // T3R-35A may be used as if it belonged to either of its neighbor's houses.
    // T3R-35A may be played as an upgrade instead of a creature, with the text: “This creature may be used as if it belonged to either of its neighbor's houses.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.canPlayAsUpgrade()
        });

        this.persistentEffect({
            condition: (context) => context.source.type === 'creature',
            effect: ability.effects.canUse(
                (card, context, effectContext) =>
                    card === effectContext.source &&
                    card.neighbors.some((n) => n.hasHouse(context.game.activePlayer.activeHouse))
            )
        });

        this.whileAttached({
            effect: ability.effects.gainAbility('persistentEffect', {
                effect: ability.effects.canUse(
                    (card, context, effectContext) =>
                        card === effectContext.source &&
                        card.neighbors.some((n) =>
                            n.hasHouse(context.game.activePlayer.activeHouse)
                        )
                )
            })
        });
    }
}

T3r35a.id = 't3r-35a';

module.exports = T3r35a;
