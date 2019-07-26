const Card = require('../../Card.js');

class EyeOfJudgement extends Card {
    setupCardAbilities(ability) {
        this.action({
            targets: {
                select: {
                    mode: 'select',
                    activePromptTitle: 'Choose which discard pile to purge from',
                    choices: {
                        'Mine': context => context.player.discard.length > 0,
                        'Opponent\'s': context => context.player.opponent && context.player.opponent.discard.length > 0
                    }
                },
                cards: {
                    dependsOn: 'select',
                    mode: 'upTo',
                    numCards: 1,
                    cardType: 'creature',
                    player: context => context.selects.select.choice === 'Mine' ? context.player : context.player.opponent,
                    location: 'discard',
                    gameAction: ability.actions.purge()
                }
            }
        });
    }
}

EyeOfJudgement.id = 'eye-of-judgement';

module.exports = EyeOfJudgement;
