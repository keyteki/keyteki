const Card = require('../../Card.js');

class YxilxDominator extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.stun()
        });
    }
}

YxilxDominator.id = 'yxilx-dominator';

module.exports = YxilxDominator;
