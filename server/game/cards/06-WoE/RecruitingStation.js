import Card from '../../Card.js';

class RecruitingStation extends Card {
    // Omni: Choose a house. Discard the top card of your deck. If it
    // belongs to the chosen house, make a token creature.
    setupCardAbilities(ability) {
        this.omni({
            target: {
                mode: 'house'
            },
            effect: 'choose {1} and discard {2}',
            effectArgs: (context) => [context.house, context.player.deck[0]],
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck.length ? context.player.deck[0] : []
            })),
            then: (preThenContext) => ({
                condition: (context) =>
                    !!context.preThenEvent.card &&
                    context.preThenEvent.card.hasHouse(preThenContext.house),
                gameAction: ability.actions.makeTokenCreature()
            })
        });
    }
}

RecruitingStation.id = 'recruiting-station';

export default RecruitingStation;
