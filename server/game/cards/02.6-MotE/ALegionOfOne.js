const DrawCard = require('../../drawcard.js');

class ALegionOfOne extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a solitary character +3/+0',
            condition: () => this.game.isDuringConflict('military'),
            target: {
                cardType: 'character',
                controller: 'self',
                cardCondition: (card, context) => card.isParticipating() && this.game.currentConflict.getCharacters(context.player).length === 1,
                gameAction: ability.actions.cardLastingEffect({
                    effect: ability.effects.modifyMilitarySkill(3)
                })
            },
            effect: 'give {0} +3/+0',
            then: context => {
                if(context.isResolveAbility) {
                    return { 
                        target: {
                            mode: 'select',
                            choices: {
                                'Remove 1 fate for no effect': ability.actions.removeFate({target: context.target }),
                                'Done': () => true
                            }
                        },
                        message: '{0} chooses {3}to remove a fate for no effect',
                        messageArgs: context => context.select === 'Done' ? 'not ' : ''
                    };
                }
                return {
                    target: {
                        mode: 'select',
                        choices: {
                            'Remove 1 fate to resolve this ability again': ability.actions.removeFate({target: context.target }),
                            'Done': () => true
                        }
                    },
                    message: '{0} chooses {3}to remove a fate to resolve {1} again',
                    messageArgs: context => context.select === 'Done' ? 'not ' : '',
                    then: { gameAction: ability.actions.resolveAbility({ ability: context.ability }) }
                };                
            }
        });
    }
}

ALegionOfOne.id = 'a-legion-of-one';

module.exports = ALegionOfOne;
