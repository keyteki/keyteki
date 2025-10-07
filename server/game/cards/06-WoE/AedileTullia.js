import Card from '../../Card.js';

class AedileTullia extends Card {
    // Each time you exalt a friendly non-token creature, make a token
    // creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onExalt: (event) =>
                    this.controller === event.context.player &&
                    event.card.controller === this.controller &&
                    !event.card.isToken()
            },
            gameAction: ability.actions.makeTokenCreature((context) => ({
                amount: context.event.amount
            }))
        });
    }
}

AedileTullia.id = 'aedile-tullia';

export default AedileTullia;
