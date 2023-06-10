const Card = require('../../Card.js');

class SavageClash extends Card {
    // Play: Destroy each creature except the most powerful enemy creature and the least powerful friendly creature.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                enemy: {
                    activePromptTitle: 'Choose an enemy creature to not destroy',
                    cardType: 'creature',
                    mode: 'mostStat',
                    controller: 'opponent',
                    numCards: 1,
                    cardStat: (card) => card.power,
                    gameAction: ability.actions.destroy((context) => ({
                        target:
                            context.player.opponent && context.targets.enemy
                                ? context.player.opponent.creaturesInPlay.filter(
                                      (card) => !context.targets.enemy.includes(card)
                                  )
                                : []
                    }))
                },
                friendly: {
                    activePromptTitle: 'Choose a friendly creature to not destroy',
                    cardType: 'creature',
                    mode: 'leastStat',
                    controller: 'self',
                    numCards: 1,
                    cardStat: (card) => card.power,
                    gameAction: ability.actions.destroy((context) => ({
                        target: context.targets.friendly
                            ? context.player.creaturesInPlay.filter(
                                  (card) => !context.targets.friendly.includes(card)
                              )
                            : []
                    }))
                }
            },
            effect: 'destroy all enemy creatures except {1}{2}{3}',
            effectArgs: (context) => [
                context.targets.enemy,
                context.targets.friendly ? ' and all friendly creatures except ' : '',
                context.targets.friendly
            ]
        });
    }
}

SavageClash.id = 'savage-clash';

module.exports = SavageClash;
