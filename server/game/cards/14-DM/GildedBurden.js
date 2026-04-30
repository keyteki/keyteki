const Card = require('../../Card.js');

class GildedBurden extends Card {
    // Play: For each forged key your opponent has, an enemy creature captures 2 from its own side.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent && context.player.opponent.getForgedKeys() > 0,
            target: {
                mode: 'upTo',
                numCards: (context) =>
                    context.player.opponent ? context.player.opponent.getForgedKeys() : 0,
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.capture((context) => ({
                    amount: 2,
                    player: context.player.opponent
                }))
            },
            effect: 'have {1} capture 2 amber from its own side'
        });
    }
}

GildedBurden.id = 'gilded-burden';

module.exports = GildedBurden;
