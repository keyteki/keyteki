const Card = require('../../Card.js');

class WitchQueen extends Card {
    // Each other friendly Witch creature enters play ready.
    //
    // While Witch Queen is in the center of your battleline, each
    // other friendly Witch creature gains skirmish, elusive, poison,
    // and “Destroyed: Return this creature to its owner’s hand.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'any',
            match: (card, context) =>
                card !== context.source && card.type === 'creature' && card.hasTrait('witch'),
            effect: ability.effects.entersPlayReady()
        });

        this.persistentEffect({
            condition: (context) => context.source.isInCenter(),
            match: (card, context) =>
                card !== context.source && card.type === 'creature' && card.hasTrait('witch'),
            effect: [
                ability.effects.addKeyword({ skirmish: 1 }),
                ability.effects.addKeyword({ elusive: 1 }),
                ability.effects.addKeyword({ poison: 1 }),
                ability.effects.gainAbility('destroyed', {
                    gameAction: ability.actions.returnToHand()
                })
            ]
        });
    }
}

WitchQueen.id = 'witch-queen';

module.exports = WitchQueen;
