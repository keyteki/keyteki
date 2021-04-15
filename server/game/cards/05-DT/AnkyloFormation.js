const Card = require('../../Card.js');

class AnkyloFormation extends Card {
    // Play: Choose one:
    // • For the remainder of the turn, a friendly creature gains skirmish.
    // • Exalt a friendly creature. For the remainder of the turn, each friendly creature gains skirmish.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'exactly',
                numCards: 1,
                cardType: 'creature',
                gameAction: ability.actions.cardLastingEffect({
                    effect: ability.effects.addKeyword({ skirmish: 1 })
                })
            },
            then: (preThenContext) => ({
                may: 'exalt this creature',
                gameAction: ability.actions.exalt({
                    target: preThenContext.target
                }),
                then: {
                    effect: 'give each friendly creature skirmish for the remainder of the turn',
                    gameAction: ability.actions.cardLastingEffect({
                        target: preThenContext.player.creaturesInPlay,
                        effect: ability.effects.addKeyword({
                            skirmish: 1
                        })
                    })
                }
            })
        });
    }
}

AnkyloFormation.id = 'ankylo-formation';

module.exports = AnkyloFormation;
