const Card = require('../../Card.js');

class NiffleKong extends Card {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.gigantic = true;
        this.playedParts = [];
        this.compositeImageId = 'niffle-kong-complete';
        this.compositeParts = ['niffle-kong2'];
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.cardCannot('play', (context) => {
                return (
                    context.source.location !== 'hand' ||
                    this.compositeParts.some(
                        (id) => !context.source.controller.hand.some((card) => id === card.id)
                    )
                );
            })
        });

        this.play({
            effect: 'return Niffle creatures from deck and discard to hand',
            target: {
                controller: 'self',
                location: ['deck', 'discard'],
                mode: 'unlimited',
                cardType: 'creature',
                cardCondition: (card) => card.hasTrait('niffle'),
                gameAction: ability.actions.sequential([
                    ability.actions.reveal({ location: ['deck', 'discard'], chatMessage: true }),
                    ability.actions.returnToHand({ location: ['deck', 'discard'] }),
                    ability.actions.shuffleDeck((context) => ({
                        target: context.player
                    }))
                ])
            }
        });

        this.fight({
            reap: true,
            optional: true,
            target: {
                controller: 'self',
                cardType: 'creature',
                cardCondition: (card) => card.hasTrait('niffle'),
                gameAction: ability.actions.destroy()
            },
            then: {
                targets: {
                    creature: {
                        controller: 'any',
                        cardType: 'creature',
                        gameAction: ability.actions.dealDamage({ amount: 3 })
                    },
                    artifact: {
                        controller: 'opponent',
                        cardType: 'artifact',
                        gameAction: ability.actions.destroy()
                    }
                },
                gameAction: ability.actions.steal((context) => ({
                    target: context.player.opponent
                }))
            }
        });
    }
}

NiffleKong.id = 'niffle-kong';

module.exports = NiffleKong;
