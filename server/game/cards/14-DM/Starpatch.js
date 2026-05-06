const Card = require('../../Card.js');

class Starpatch extends Card {
    // Enhance unfathomable unfathomable.
    // This creature gains, "At the start of your turn, if this creature is exhausted, purge another creature that shares a house with it."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reaction', {
                when: {
                    onTurnStart: (_event, context) => context.player === context.game.activePlayer
                },
                condition: (context) =>
                    context.source.exhausted &&
                    context.game.creaturesInPlay.some(
                        (card) =>
                            card !== context.source &&
                            card.getHouses().some((h) => context.source.hasHouse(h))
                    ),
                target: {
                    cardType: 'creature',
                    cardCondition: (card, context) =>
                        card !== context.source &&
                        card.getHouses().some((h) => context.source.hasHouse(h)),
                    gameAction: ability.actions.purge()
                },
                effect: 'purge {0}'
            })
        });
    }
}

Starpatch.id = 'starpatch';

module.exports = Starpatch;
