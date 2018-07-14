const DrawCard = require('../../drawcard.js');

class SoshiShiori extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction ({
            title: 'Make opponent lose 1 honor',
            limit: ability.limit.unlimitedPerConflict(),
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player
            },
            target: {
                mode: 'select',
                activePromptTitle:'Choose a player to lose 1 honor',
                choices: {
                    'Me': ability.actions.loseHonor(context => ({ target: context.player })),
                    'Opponent': ability.actions.loseHonor()
                }
            },
            effect: 'make {0} lose 1 honor'
        });
    }
}

SoshiShiori.id = 'soshi-shiori';
module.exports = SoshiShiori;
