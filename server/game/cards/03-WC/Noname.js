const Card = require('../../Card.js');

class Noname extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyPower(() => this.controller.purged.length + this.controller.opponent.purged.length)
        });
        this.play({
            fight: true,
            reap: true,
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
                    mode: 'exactly',
                    numCards: 1,
                    controller: context => context.selects.select.choice === 'Mine' ? 'self' : 'opponent',
                    location: 'discard',
                    gameAction: ability.actions.purge()
                }
            }
        });
    }
}

Noname.id = 'noname';

module.exports = Noname;
