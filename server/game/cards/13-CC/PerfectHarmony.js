import Card from '../../Card.js';

class PerfectHarmony extends Card {
    // Play: Draw 2 cards, gain 2A, and archive a card if you control creatures from 3 or more different houses.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.game.getHousesInPlay(context.player.creaturesInPlay).length >= 3,
            gameAction: ability.actions.sequential([
                ability.actions.draw({ amount: 2 }),
                ability.actions.gainAmber({ amount: 2 })
            ]),
            effect: 'draw 2 cards, gain 2 amber, and archive a card',
            then: {
                target: {
                    controller: 'self',
                    location: 'hand',
                    gameAction: ability.actions.archive()
                }
            }
        });
    }
}

PerfectHarmony.id = 'perfect-harmony';

export default PerfectHarmony;
