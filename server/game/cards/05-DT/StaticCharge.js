import Card from '../../Card.js';

class StaticCharge extends Card {
    // This creature gains, "At the start of your turn, deal 2D to each of this creature's neighbors."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reaction', {
                when: {
                    onBeginRound: (_event, context) => context.player === context.game.activePlayer
                },
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: 2,
                    target: context.source.neighbors,
                    damageSource: context.source
                }))
            })
        });
    }
}

StaticCharge.id = 'static-charge';

export default StaticCharge;
