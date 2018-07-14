const DrawCard = require('../../drawcard.js');

class InvocationOfAsh extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move to another character',
            cost: ability.costs.payHonor(1),
            target: {
                cardType: 'character',
                controller: 'self',
                gameAction: ability.actions.attach(context => ({ attachment: context.source }))
            },
            then: context => ({
                message: '{1} removes one fate from {3}',
                messageArgs: context.target,
                gameAction: ability.actions.removeFate({ target: context.target })
            })
        });
    }
}

InvocationOfAsh.id = 'invocation-of-ash';

module.exports = InvocationOfAsh;
