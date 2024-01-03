const Card = require('../../Card.js');

class ThreeLLI0T extends Card {
    // Play/After Fight/After Reap: You may play an upgrade from your
    // discard pile on 3LL-I0T.
    //
    // Scrap: Shuffle all upgrades from play into their owners’ decks.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            fight: true,
            target: {
                controller: 'self',
                location: 'discard',
                cardType: 'upgrade',
                gameAction: ability.actions.playUpgradeOnParent((context) => ({
                    parent: context.source
                }))
            }
        });

        this.scrap({
            gameAction: ability.actions.returnToDeck((context) => ({
                target: context.game.creaturesInPlay.flatMap((card) => card.upgrades || []),
                shuffle: true
            }))
        });
    }
}

ThreeLLI0T.id = '3ll-i0t';

module.exports = ThreeLLI0T;
