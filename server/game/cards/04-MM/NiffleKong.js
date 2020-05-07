const Card = require('../../Card.js');

class NiffleKong extends Card {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.gigantic = true;
        this.playedParts = [];
        this.compositeImageId = 'niffle-kong-complete';
        this.compositeParts = ['niffle-kong-2'];
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            match: this,
            effect: ability.effects.cardCannot('play', context => {
                return context.source.location !== 'hand' ||
                    this.compositeParts.some(id => !context.source.controller.hand.some(card => id === card.id));
            })
        });

        this.play({
            effect: 'return all Niffle creatures from deck and discard to hand',
            gameAction: [
                ability.actions.reveal(context => ({
                    location: 'deck',
                    chatMessage: true,
                    target: context.player.deck.filter(card => card.type === 'creature' && card.hasTrait('niffle'))
                })),
                ability.actions.reveal(context => ({
                    location: 'discard',
                    chatMessage: true,
                    target: context.player.discard.filter(card => card.type === 'creature' && card.hasTrait('niffle'))
                })),
                ability.actions.returnToHand(context => ({
                    location: 'deck',
                    target: context.player.deck.filter(card => card.type === 'creature' && card.hasTrait('niffle'))
                })),
                ability.actions.returnToHand(context => ({
                    location: 'discard',
                    target: context.player.discard.filter(card => card.type === 'creature' && card.hasTrait('niffle'))
                })),
                ability.actions.shuffleDeck(context => ({
                    target: context.player
                }))
            ]
        });

        this.fight({
            reap: true,
            target: {
                controller: 'self',
                cardType: 'creature',
                cardCondition: card => card.hasTrait('niffle'),
                gameAction: ability.actions.destroy()
            },
            then: {
                targets: {
                    creature: {
                        controller: 'opponent',
                        cardType: 'creature',
                        gameAction: ability.actions.dealDamage({ amount: 3 })
                    },
                    artifact: {
                        controller: 'opponent',
                        cardType: 'artifact',
                        gameAction: ability.actions.destroy()
                    }
                },
                gameAction: ability.actions.steal(context => ({
                    target: context.player.opponent
                }))
            }
        });
    }
}

NiffleKong.id = 'niffle-kong';

module.exports = NiffleKong;
