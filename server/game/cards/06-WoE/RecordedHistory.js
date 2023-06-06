const Card = require('../../Card.js');

class RecordedHistory extends Card {
    // Play: Reveal up to 3 cards of different houses from your
    // hand. Archive each card revealed this way.
    setupCardAbilities(ability) {
        this.play({
            target: {
                optional: true,
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.archive({ reveal: true })
            },
            then: (preThenContext) => ({
                target: {
                    optional: true,
                    controller: 'self',
                    location: 'hand',
                    cardCondition: (card) =>
                        card.getHouses().some((house) => !preThenContext.target.hasHouse(house)),
                    gameAction: ability.actions.archive({ reveal: true })
                },
                message: '{0} uses {1} to archive {3}',
                messageArgs: (context) => [context.target],
                then: (preThenContext2) => ({
                    target: {
                        optional: true,
                        controller: 'self',
                        location: 'hand',
                        cardCondition: (card) =>
                            card
                                .getHouses()
                                .some((house) => !preThenContext.target.hasHouse(house)) &&
                            card
                                .getHouses()
                                .some((house) => !preThenContext2.target.hasHouse(house)),
                        gameAction: ability.actions.archive({ reveal: true })
                    },
                    message: '{0} uses {1} to archive {3}',
                    messageArgs: (context) => [context.target]
                })
            })
        });
    }
}

RecordedHistory.id = 'recorded-history';

module.exports = RecordedHistory;
