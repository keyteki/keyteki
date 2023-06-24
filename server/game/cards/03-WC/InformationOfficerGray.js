const Card = require('../../Card.js');

class InformationOfficerGray extends Card {
    // Play/Fight/Reap: You may reveal a non-Star Alliance card from your hand. If you do, archive it.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            target: {
                mode: 'upTo',
                numCards: 1,
                controller: 'self',
                location: 'hand',
                cardCondition: (card) => !card.hasHouse('staralliance'),
                gameAction: ability.actions.archive()
            },
            effect: 'reveal {1}{2}',
            effectArgs: (context) => [
                context.target.length > 0 ? context.target : undefined,
                context.target.length > 0 ? ' from their hand, and archive it' : 'no cards'
            ]
        });
    }
}

InformationOfficerGray.id = 'information-officer-gray';

module.exports = InformationOfficerGray;
