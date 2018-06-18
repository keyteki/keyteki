const DrawCard = require('../../drawcard.js');

class Levy extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Take an honor or a fate from your opponent',
            condition: context => context.player.opponent,
            target: {
                player: 'opponent',
                mode: 'select',
                choices: {
                    'Give your opponent 1 fate': ability.actions.takeFate(),
                    'Give your opponent 1 honor': ability.actions.takeHonor()
                }
            }
        });
    }
}

Levy.id = 'levy';

module.exports = Levy;
