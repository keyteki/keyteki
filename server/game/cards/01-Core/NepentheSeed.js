import Card from '../../Card.js';

class NepentheSeed extends Card {
    // Omni: Sacrifice Nepenthe Seed. Return a card from your discard pile to your hand.
    setupCardAbilities(ability) {
        this.omni({
            target: {
                location: 'discard',
                controller: 'self',
                gameAction: ability.actions.returnToHand({ location: 'discard' })
            },
            gameAction: ability.actions.sacrifice()
        });
    }
}

NepentheSeed.id = 'nepenthe-seed';

export default NepentheSeed;
