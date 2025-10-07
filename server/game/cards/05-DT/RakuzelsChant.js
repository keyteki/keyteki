import Card from '../../Card.js';

class RakuzelsChant extends Card {
    // (T) Play: Exhaust a creature. If the tide is high, exhaust each creature instead.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !context.player.isTideHigh(),
            target: {
                cardType: 'creature',
                gameAction: ability.actions.exhaust()
            }
        });

        this.play({
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.exhaust((context) => ({
                target: context.game.creaturesInPlay
            }))
        });
    }
}

RakuzelsChant.id = 'rakuzel-s-chant';

export default RakuzelsChant;
