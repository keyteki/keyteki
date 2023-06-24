const Card = require('../../Card.js');

class MasterTheTheory extends Card {
    // Play: If there are no friendly creatures in play, you may archive a card for each enemy creature.
    setupCardAbilities(ability) {
        this.play({
            condition: () => this.controller.creaturesInPlay.length === 0,
            effect: ' to archive a card for each creature {1} has in play ({2}).',
            effectArgs: (context) => [
                context.player.opponent,
                context.player.opponent.creaturesInPlay.length
            ],
            targets: {
                cards: {
                    mode: 'upTo',
                    numCards: (context) => context.player.opponent.creaturesInPlay.length,
                    controller: 'self',
                    location: 'hand',
                    gameAction: ability.actions.archive()
                }
            }
        });
    }
}

MasterTheTheory.id = 'master-the-theory';

module.exports = MasterTheTheory;
