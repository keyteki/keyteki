const Card = require('../../Card.js');

class Kaspara extends Card {
    // X is the combined total of between each player’s pools.
    //
    // Each friendly Geistoid creature gains, “Play/Destroyed: Each
    // player gains 1 A.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower(
                (card) =>
                    card.controller.amber +
                    (card.controller.opponent ? card.controller.opponent.amber : 0)
            )
        });

        this.persistentEffect({
            match: (card) => card.type === 'creature' && card.hasHouse('geistoid'),
            targetLocation: 'any',
            effect: [
                ability.effects.gainAbility('play', {
                    gameAction: [
                        ability.actions.gainAmber(),
                        ability.actions.gainAmber((context) => ({
                            target: context.player.opponent
                        }))
                    ]
                }),
                ability.effects.gainAbility('destroyed', {
                    gameAction: [
                        ability.actions.gainAmber(),
                        ability.actions.gainAmber((context) => ({
                            target: context.player.opponent
                        }))
                    ]
                })
            ]
        });
    }
}

Kaspara.id = 'kaspara';

module.exports = Kaspara;
