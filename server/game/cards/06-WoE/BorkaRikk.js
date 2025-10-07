import Card from '../../Card.js';

class BorkaRikk extends Card {
    // Each time a Mars card is discarded from your hand, make a token
    // creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.location === 'hand' &&
                    event.card.controller === context.player &&
                    event.card.hasHouse('mars')
            },
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

BorkaRikk.id = 'borka-rikk';

export default BorkaRikk;
