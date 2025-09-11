const Card = require('../../Card.js');

class NightmareInducer extends Card {
    // Action: Choose a card in your opponent's discard pile. Exhaust
    // each enemy creature that shares a house with that card. Put
    // that card on the bottom of your opponent’s deck.
    setupCardAbilities(ability) {
        this.action({
            effectStyle: 'all',
            condition: (context) =>
                !!context.player.opponent && context.player.opponent.discard.length > 0,
            target: {
                controller: 'opponent',
                location: 'discard',
                gameAction: [
                    ability.actions.exhaust((context) => ({
                        target: context.player.opponent.creaturesInPlay.filter((c) =>
                            context.target.getHouses().some((house) => c.hasHouse(house))
                        )
                    })),
                    ability.actions.returnToDeck({ bottom: true })
                ]
            }
        });
    }
}

NightmareInducer.id = 'nightmare-inducer';

module.exports = NightmareInducer;
