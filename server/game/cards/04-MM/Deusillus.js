const Card = require('../../Card.js');

class Deusillus extends Card {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.gigantic = true;
        this.playedParts = [];
        this.compositeImageId = 'deusillus-complete';
        this.compositeParts = ['deusillus2'];
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.cardCannot('play', (context) => {
                return this.compositeParts
                    .concat(this.id)
                    .some((id) => !context.source.controller.hand.some((card) => id === card.id));
            })
        });

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
