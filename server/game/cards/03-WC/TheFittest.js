import Card from '../../Card.js';

class TheFittest extends Card {
    // Play: Give each friendly creature a +1 power counter.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.addPowerCounter((context) => ({
                target: context.player.creaturesInPlay,
                amount: 1
            }))
        });
    }
}

TheFittest.id = 'the-fittest';

export default TheFittest;
