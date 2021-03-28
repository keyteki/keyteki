const Card = require('../../Card.js');

class SelwynTheFence extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                activePromptTitle: 'Choose a captured amber to move to your pool.',
                cardCondition: (card) => card.hasToken('amber'),
                controller: 'self',
                gameAction: ability.actions.removeAmber()
            },
            effect: 'move 1 amber from {0} to their pool',
            then: {
                gameAction: ability.actions.gainAmber()
            }
        });
    }
}

SelwynTheFence.id = 'selwyn-the-fence';

module.exports = SelwynTheFence;
