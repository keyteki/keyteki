const DrawCard = require('../../drawcard.js');

class ForShame extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Dishonor or bow a character',
            condition: context => context.player.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('courtier')),
            targets: {
                character: {
                    cardType: 'character',
                    controller: 'opponent',
                    cardCondition: card => card.isParticipating()
                },
                select: {
                    mode: 'select',
                    dependsOn: 'character',
                    player: 'opponent',
                    choices: {
                        'Dishonor this character': ability.actions.dishonor(context => ({ target: context.targets.character })),
                        'Bow this character': ability.actions.bow(context => ({ target: context.targets.character }))
                    }
                }
            }
        });
    }
}

ForShame.id = 'for-shame';

module.exports = ForShame;
