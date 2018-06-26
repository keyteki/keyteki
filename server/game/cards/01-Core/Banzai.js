const DrawCard = require('../../drawcard.js');

class Banzai extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Increase a character\'s military skill',
            condition: () => this.game.isDuringConflict(),
            max: ability.limit.perConflict(1),
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect(() => ({
                    effect: ability.effects.modifyMilitarySkill(2)
                }))
            },
            effect: 'grant 2 military skill to {0}',
            then: context => {
                if(context.secondResolution) {
                    return {
                        target: {
                            mode: 'select',
                            choices: {
                                'Lose 1 honor for no effect': ability.actions.loseHonor({target: context.player }),
                                'Done': () => true
                            }
                        },
                        message: '{0} chooses {3}to lose an honor for no effect',
                        messageArgs: context => context.select === 'Done' ? 'not ' : ''
                    };
                }
                return {
                    target: {
                        mode: 'select',
                        choices: {
                            'Lose 1 honor to resolve this ability again': ability.actions.loseHonor({target: context.player }),
                            'Done': () => true
                        }
                    },
                    message: '{0} chooses {3}to lose an honor to resolve {1} again',
                    messageArgs: context => context.select === 'Done' ? 'not ' : '',
                    then: { gameAction: ability.actions.resolveAbility({ ability: context.ability, secondResolution: true }) }
                };
            }
        });
    }
}

Banzai.id = 'banzai';

module.exports = Banzai;
