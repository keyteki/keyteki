const Card = require('../../Card.js');

class BurningGlare extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'select',
                choices: {
                    'Stun an enemy creature': ability.actions.stun({
                        promptForSelect: {
                            activePromptTitle: 'Choose a creature to stun',
                            cardType: 'creature',
                            controller: 'opponent'
                        }
                    }),
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
