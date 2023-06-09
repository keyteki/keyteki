const Card = require('../../Card.js');

class MadProphetGizelhart extends Card {
    // While Mad Prophet Gizelhart is in the center of your battleline, it gains, "Action: Fully heal each non-Mutant creature. Gain 1 for each creature healed this way."
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isInCenter(),
            targetController: 'current',
            effect: ability.effects.gainAbility('action', {
                effect: 'fully heal all non-mutant creatures',
                gameAction: ability.actions.heal((context) => ({
                    fully: true,
                    target: context.game.creaturesInPlay.filter(
                        (card) => card.hasToken('damage') && !card.hasTrait('mutant')
                    )
                })),
                then: {
                    message: '{1} heals {3}, gaining {0} {4} amber',
                    messageArgs: (context) => {
                        let successfulEvents = context.preThenEvents.filter(
                            (event) => !event.cancelled && event.amount > 0
                        );
                        return [
                            successfulEvents.map((event) => event.card),
                            successfulEvents.length
                        ];
                    },
                    gameAction: ability.actions.gainAmber((context) => ({
                        amount: context.preThenEvents.filter(
                            (event) => !event.cancelled && event.amount > 0
                        ).length
                    }))
                }
            })
        });
    }
}

MadProphetGizelhart.id = 'mad-prophet-gizelhart';

module.exports = MadProphetGizelhart;
