import Card from '../../Card.js';

class Congregate extends Card {
    // Play: Choose a trait. if there are 2 or more friendly creatures with that trait, gain 2A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'trait'
            },
            effect: 'choose the {1} trait and gain {2} amber',
            effectArgs: (context) => [
                context.trait,
                context.game.creaturesInPlay.filter(
                    (card) => card.controller === context.player && card.hasTrait(context.trait)
                ).length >= 2
                    ? 2
                    : 0
            ],
            gameAction: ability.actions.gainAmber((context) => ({
                amount:
                    context.game.creaturesInPlay.filter(
                        (card) => card.controller === context.player && card.hasTrait(context.trait)
                    ).length >= 2
                        ? 2
                        : 0
            }))
        });
    }
}

Congregate.id = 'congregate';

export default Congregate;
