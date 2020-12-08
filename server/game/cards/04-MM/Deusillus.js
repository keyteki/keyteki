const GiganticCard = require('../../GiganticCard.js');

class Deusillus extends GiganticCard {
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.play({
            preferActionPromptMessage: true,
            gameAction: ability.actions.sequential([
                ability.actions.capture((context) => ({
                    amount: context.player.opponent ? context.player.opponent.amber : 0
                })),
                ability.actions.dealDamage((context) => ({
                    amount: 5,
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature',
                        cardType: 'creature',
                        controller: 'opponent',
                        message: '{0} uses {1} to capture all amber and deal 5 damage to {2}',
                        messageArgs: (card) => [context.player, context.source, card]
                    }
                }))
            ])
        });

        this.fight({
            reap: true,
            effect: 'remove 1 amber from {0} and deal 2 damage to all enemy creatures',
            gameAction: ability.actions.sequential([
                ability.actions.removeAmber(),
                ability.actions.dealDamage((context) => ({
                    amount: 2,
                    target: context.player.opponent && context.player.opponent.creaturesInPlay
                }))
            ])
        });
    }
}

Deusillus.id = 'deusillus';

module.exports = Deusillus;
