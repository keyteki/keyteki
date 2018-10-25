const Card = require('../../Card.js');

class EvasionSigil extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onInitiateFight: () => true,
            },
            effect: 'discard the top card of {1}\'s deck: {2}.{3}{4}',
            effectArgs: context => {
                let player = context.event.card.controller;
                let topCard = player.deck.length ? player.deck[0] : '';
                return [player, topCard, topCard ? context.event.card : '', topCard ? ' is exhausted without effect' : ''];
            }
        });
    }
}

EvasionSigil.id = 'evasion-sigil'; // This is a guess at what the id might be - please check it!!!

module.exports = EvasionSigil;
