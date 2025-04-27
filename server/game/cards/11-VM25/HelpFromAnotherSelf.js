const Card = require('../../Card.js');

/**
 * Play: Search your deck and discard pile for a Variant creature, reveal it, and put it into your hand.
 */
class HelpFromAnotherSelf extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'search their deck and discard pile for a Variant creature',
            gameAction: ability.actions.search({
                cardCondition: (card) => card.hasTrait('variant') && card.type === 'creature',
                location: ['deck', 'discard'],
                reveal: true,
                amount: 1
            })
        });
    }
}

HelpFromAnotherSelf.id = 'help-from-another-self';

module.exports = HelpFromAnotherSelf;
