const Card = require('../../Card.js');

class MasterTheTheory extends Card {
    // Play: If there are no friendly creatures in play, you may archive a card for each enemy creature.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.creaturesInPlay.length === 0,
            effect: 'archive a card for each of the {2} creature{3} that {1} has in play ({4})',
            effectArgs: (context) => {
                const creatures = context.player.opponent.creaturesInPlay;
                return [
                    context.player.opponent,
                    creatures.length,
                    creatures.length === 1 ? '' : 's',
                    creatures
                ];
            },
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
