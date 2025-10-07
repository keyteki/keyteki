import Card from '../../Card.js';

class TrustYourFeelings extends Card {
    // When a card is placed under Trust Your Feelings, name a house. The next time your opponent chooses the named house as their active house, fulfill Trust Your Feelings.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPlaceUnder: (event, context) =>
                    event.card.parent === context.source && context.source.activeProphecy
            },
            location: 'any',
            target: {
                mode: 'house'
            },
            effect: 'name {1}',
            effectArgs: (context) => [context.house],
            gameAction: ability.actions.lastingEffect((context) => ({
                until: {
                    onProphecyDeactivated: (event) => event.prophecyCard === context.source
                },
                targetController: 'opponent',
                effect: ability.effects.lastingAbilityTrigger({
                    triggeredAbilityType: 'reaction',
                    when: {
                        onChooseActiveHouse: (event) => event.house === context.house
                    },
                    gameAction: ability.actions.fulfillProphecy((context) => ({
                        card: context.source
                    }))
                })
            }))
        });
    }
}

TrustYourFeelings.id = 'trust-your-feelings';

export default TrustYourFeelings;
