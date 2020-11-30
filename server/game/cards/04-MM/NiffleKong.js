const GiganticCard = require('../../GiganticCard.js');

class NiffleKong extends GiganticCard {
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

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
