const Card = require('../../Card.js');

class SelwynTheFence extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.removeAmber()
            },
            effect: 'move 1 amber from {0} to their pool',
            gameAction: ability.actions.gainAmber()
        });
    }
}

SelwynTheFence.id = 'selwyn-the-fence'; // This is a guess at what the id might be - please check it!!!

module.exports = SelwynTheFence;
