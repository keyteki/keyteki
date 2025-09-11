const Card = require('../../Card.js');

class QyxxlyxxGraveMaster extends Card {
    // Play: Purge a creature from a discard pile. Deal 2 D to each
    // creature that shares one or more traits with the purged
    // creature.
    //
    // Destroyed: If you are haunted, archive Qyxxlyxx Grave Master.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'any',
                location: 'discard',
                gameAction: ability.actions.purge()
            },
            then: (preThenContext) => ({
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: 2,
                    target: context.game.creaturesInPlay.filter((card) =>
                        card.getTraits().some((trait) => preThenContext.target.hasTrait(trait))
                    )
                }))
            })
        });

        this.destroyed({
            condition: (context) => context.source.controller.isHaunted(),
            gameAction: ability.actions.archive()
        });
    }
}

QyxxlyxxGraveMaster.id = 'qyxxlyxx-grave-master';

module.exports = QyxxlyxxGraveMaster;
