const Card = require('../../Card.js');

class GildedBurden extends Card {
    // Play: For each forged key your opponent has, an enemy creature captures 2A from its own side.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent && context.player.opponent.getForgedKeys() > 0,
            effect: 'have an enemy creature capture 2 amber from its own side for each forged key their opponent has',
            gameAction: ability.actions.allocateCapture((context) => ({
                amberStep: 2,
                numSteps: context.player.opponent ? context.player.opponent.getForgedKeys() : 0,
                controller: 'opponent',
                player: context.player.opponent,
                menuTitle: 'Choose an enemy creature to capture 2 amber on'
            }))
        });
    }
}

GildedBurden.id = 'gilded-burden';

module.exports = GildedBurden;
