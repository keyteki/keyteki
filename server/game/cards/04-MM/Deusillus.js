const GiganticCard = require('../../GiganticCard.js');

class Deusillus extends GiganticCard {
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.capture((context) => ({
                    amount: context.player.opponent ? context.player.opponent.amber : 0
                })),
                ability.actions.dealDamage({
                    amount: 5,
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature',
                        cardType: 'creature',
                        controller: 'opponent'
                    }
                })
            ])
        });

        this.fight({
            reap: true,
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
