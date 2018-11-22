const Card = require('../../Card.js');

class ImperialTraitor extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            gameAction: ability.actions.reveal(context => ({ target: context.player.opponent.hand })),
            then: context => ({
                may: 'purge a sanctum card',
                gameAction: ability.actions.purge({
                    promptWithHandlerMenu: {
                        cards: context.player.opponent.hand.filter(card => card.hasHouse('sanctum')),
                        message: '{0} chooses to purge {2}'
                    }
                })
            })
        });
    }
}

ImperialTraitor.id = 'imperial-traitor'; // This is a guess at what the id might be - please check it!!!

module.exports = ImperialTraitor;
