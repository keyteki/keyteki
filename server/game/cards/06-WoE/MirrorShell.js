const Card = require('../../Card.js');

class MirrorShell extends Card {
    // Play: Make a token creature.
    //
    // This creature gains, "After Fight/After Reap: For the remainder
    // of the turn, each friendly token creature is a copy of this
    // creature."
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature()
        });

        this.whileAttached({
            effect: ability.effects.gainAbility('fight', {
                reap: true,
                effect: 'make all friendly token creatures a copy of {0}',
                gameAction: ability.actions.forRemainderOfTurn((context) => ({
                    controller: 'self',
                    cardType: 'creature',
                    match: (card) => card.isToken(),
                    effect: ability.effects.copyCard(context.source)
                }))
            })
        });
    }
}

MirrorShell.id = 'mirror-shell';

module.exports = MirrorShell;
