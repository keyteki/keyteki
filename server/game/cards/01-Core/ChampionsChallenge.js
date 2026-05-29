const Card = require('../../Card.js');

class ChampionsChallenge extends Card {
    // Play: Destroy each enemy creature except the most powerful enemy creature. Destroy each friendly creature except the most powerful friendly creature. Ready and fight with your remaining creature.
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
                    mode: 'mostStat',
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
            effect: '{1}{2}{3}{4}',
            effectArgs: (context) => {
                const enemy = context.targets.enemy;
                const friendly = context.targets.friendly;
                if (!enemy && !friendly) return ['do nothing', '', '', ''];
                if (enemy && friendly)
                    return [
                        'destroy all enemy creatures except ',
                        enemy,
                        ' and all friendly creatures except ',
                        friendly
                    ];
                if (enemy) return ['destroy all enemy creatures except ', enemy, '', ''];
                return ['destroy all friendly creatures except ', friendly, '', ''];
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.creaturesInPlay.length,
                target: {
                    activePromptTitle: 'Choose a creature to fight with',
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.sequential([
                        ability.actions.ready(),
                        ability.actions.fight()
                    ])
                }
            }
        });
    }
}

ChampionsChallenge.id = 'champion-s-challenge';

module.exports = ChampionsChallenge;
