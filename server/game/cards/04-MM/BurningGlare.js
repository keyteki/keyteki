const Card = require('../../Card.js');

class BurningGlare extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'select',
                choices: {
                    'Stun an enemy creature': ability.actions.stun((context) => ({
                        promptForSelect: {
                            message: '{0} uses {1} to stun {2}',
                            messageArgs: (cards) => [context.player, context.source, cards],
                            activePromptTitle: 'Choose a creature to stun',
                            controller: 'opponent',
                            cardType: 'creature'
                        }
                    })),
                    'Stun all enemy mutants': ability.actions.stun((context) => ({
                        target: context.game.creaturesInPlay.filter(
                            (card) => card.hasTrait('mutant') && card.controller !== context.player
                        )
                    }))
                }
            }
        });
    }
}

BurningGlare.id = 'burning-glare';

module.exports = BurningGlare;
