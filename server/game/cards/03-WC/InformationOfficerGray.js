const Card = require('../../Card.js');

class InformationOfficerGray extends Card {
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            target: {
                mode: 'upTo',
                numCards: 1,
                controller: 'self',
                location: 'hand',
                cardCondition: card => !card.hasHouse('staralliance'),
                gameAction: ability.actions.archive()
            },
            effect: 'reveal {1} from their hand, and archive it.',
            effectArgs: context => [context.target.reveal]
        });
    }
}

InformationOfficerGray.id = 'information-officer-gray';

module.exports = InformationOfficerGray;
