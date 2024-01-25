const Card = require('../../Card.js');

class JunkyardCemetery extends Card {
    // While there is a combined total of 10 or more cards between
    // your purged cards and discard pile, you are haunted.
    //
    // Action: Purge a card in your discard pile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.countPurgedForHaunted()
        });

        this.action({
            target: {
                controller: 'self',
                location: 'discard',
                gameAction: ability.actions.purge()
            }
        });
    }
}

JunkyardCemetery.id = 'junkyard-cemetery';

module.exports = JunkyardCemetery;
