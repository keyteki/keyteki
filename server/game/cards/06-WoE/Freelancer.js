import Card from '../../Card.js';

class Freelancer extends Card {
    // At the start of each turn, the active player takes control of
    // this creature. This creature may be used as if it belonged to
    // the active house.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reaction', {
                when: {
                    onBeginRound: () => true
                },
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.game.activePlayer)
                }))
            })
        });

        this.whileAttached({
            effect: ability.effects.gainAbility('persistentEffect', {
                effect: ability.effects.canUse((card) => card === this.parent)
            })
        });
    }
}

Freelancer.id = 'freelancer';

export default Freelancer;
