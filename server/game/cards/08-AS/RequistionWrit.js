import Card from '../../Card.js';

class RequisitionWrit extends Card {
    // This creature gains, “After Reap: Pay your opponent 1A. If you
    // do, take control of an enemy creature."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.transferAmber((context) => ({
                    target: context.player,
                    amount: 1
                })),
                then: {
                    target: {
                        controller: 'opponent',
                        cardType: 'creature',
                        gameAction: ability.actions.cardLastingEffect((context) => ({
                            duration: 'lastingEffect',
                            effect: ability.effects.takeControl(context.player)
                        }))
                    },
                    message: '{0} uses {1} to take control of {3}',
                    messageArgs: (context) => [context.target]
                }
            })
        });
    }
}

RequisitionWrit.id = 'requisition-writ';

export default RequisitionWrit;
