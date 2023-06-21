const Card = require('../../Card.js');

class SibylWaimare extends Card {
    // At the start of your opponent's turn, that player discards the top card
    // of their deck and exhausts each creature of that card's house.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBeginRound: (_, context) =>
                    context.player.opponent === this.game.activePlayer &&
                    context.player.opponent.deck.length > 0
            },
            gameAction: ability.actions.discard((context) => ({
                target: context.player.opponent.deck[0]
            })),
            then: {
                gameAction: ability.actions.exhaust((context) => ({
                    target: context.game.creaturesInPlay.filter((card) =>
                        context.preThenEvent.card.getHouses().some((house) => card.hasHouse(house))
                    )
                }))
            }
        });
    }
}

SibylWaimare.id = 'sibyl-waimare';

module.exports = SibylWaimare;
