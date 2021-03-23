const Card = require('../../Card.js');

class BurningGlare extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.game.creaturesInPlay.length > 0,
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Stun an enemy creature': () => true,
                        'Stun all enemy mutants': ability.actions.stun((context) => ({
                            target: context.game.creaturesInPlay.filter(
                                (card) =>
                                    card.hasTrait('mutant') && card.controller !== context.player
                            )
                        }))
                    }
                },
                'Stun an enemy creature': {
                    dependsOn: 'action',
                    activePromptTitle: 'Choose a creature to stun',
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.stun()
                }
            }
        });
    }
}

BurningGlare.id = 'burning-glare';

module.exports = BurningGlare;
