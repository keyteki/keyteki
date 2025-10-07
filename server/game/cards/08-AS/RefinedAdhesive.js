import Card from '../../Card.js';

class RefinedAdhesive extends Card {
    // Each time a card would be discarded from a player's hand,
    // reveal the card and put it facedown under this creature
    // instead.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardDiscarded: (event, context) =>
                    event.location === 'hand' && context.source.parent
            },
            gameAction: [
                ability.actions.placeUnder((context) => ({
                    target: context.event.card,
                    parent: context.source.parent,
                    facedown: true
                })),
                ability.actions.changeEvent((context) => ({
                    event: context.event,
                    cancel: true
                }))
            ]
        });
    }
}

RefinedAdhesive.id = 'refined-adhesive';

export default RefinedAdhesive;
