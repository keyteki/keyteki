import Card from '../../Card.js';

class BeachDay extends Card {
    // (T) Play: Return a creature to its owner's hand. If the tide is high, gain 1A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.returnToHand()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.isTideHigh(),
                gameAction: ability.actions.gainAmber(),
                message: '{0} uses {1} to gain 1 amber'
            }
        });
    }
}

BeachDay.id = 'beach-day';

export default BeachDay;
