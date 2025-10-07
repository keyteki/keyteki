import Card from '../../Card.js';

class MakeItSo extends Card {
    // Play: Choose a house. Reveal the top card of your deck. If that card belongs to the chosen house, draw it and trigger this effect again.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'house'
            },
            effect: 'choose {1} and reveal {2}',
            effectArgs: (context) => [context.house, context.player.deck[0]],
            gameAction: ability.actions.reveal((context) => ({
                location: 'deck',
                target: context.player.deck[0]
            })),
            then: (preThenContext) => ({
                condition: () => preThenContext.player.deck[0].hasHouse(preThenContext.house),
                gameAction: [
                    ability.actions.draw(),
                    ability.actions.resolveAbility({
                        ability: preThenContext.ability
                    })
                ],
                message: '{0} uses {1} to draw the card and resolve its effect again'
            })
        });
    }
}

MakeItSo.id = 'make-it-so';

export default MakeItSo;
