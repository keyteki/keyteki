const Card = require('../../Card.js');

class ChampionsChallenge extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                enemy: {
                    activePromptTitle: 'Choose an enemy creature to not destroy',
                    cardType: 'creature',
                    mode: 'mostStat',
                    controller: 'opponent',
                    numCards: 1,
                    cardStat: card => card.power,
                    gameAction: ability.actions.destroy(context => ({
                        target: context.player.opponent ? context.player.opponent.creaturesInPlay.filter(card => card !== context.target) : []
                    }))
                },
                friendly: {
                    activePromptTitle: 'Choose an friendly creature to not destroy',
                    cardType: 'creature',
                    mode: 'mostStat',
                    controller: 'self',
                    numCards: 1,
                    cardStat: card => card.power,
                    gameAction: ability.actions.destroy(context => ({
                        target: context.player.creaturesInPlay.filter(card => card !== context.target)
                    }))
                }
            },
            effect: 'destroy all enemy creatures except {1}{2}{3}',
            effectArgs: context => [context.targets.enemy, context.targets.friendly ? ' and all friendly creatures except ' : '', context.targets.friendly],
            then: {
                alwaysTriggers: true,
                condition: context => context.player.creaturesInPlay.length && context.player.opponent && context.player.opponent.creaturesInPlay.length,
                target: {
                    activePromptTitle: 'Choose a creature to fight with',
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.fight()
                }
            }
        });
    }
}

ChampionsChallenge.id = 'champion-s-challenge'; // This is a guess at what the id might be - please check it!!!

module.exports = ChampionsChallenge;
