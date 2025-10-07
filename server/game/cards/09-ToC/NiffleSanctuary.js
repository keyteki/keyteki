import Card from '../../Card.js';

class NiffleSanctuary extends Card {
    // Action: Make a Niffle Brute. Until the end of the turn each
    // Niffle Brute gains, “After Fight: Gain 1A.”
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.conditional({
                condition: (context) =>
                    context.player.tokenCard && context.player.tokenCard.name === 'Niffle Brute',
                trueGameAction: ability.actions.makeTokenCreature()
            }),
            effect: '{1}',
            effectArgs: (context) => [
                context.player.tokenCard && context.player.tokenCard.name === 'Niffle Brute'
                    ? 'make a token creature'
                    : 'do nothing'
            ],
            then: {
                alwaysTriggers: true,
                message:
                    '{0} uses {1} to make each friendly Niffle Brute gain "After Fight: Gain 1 amber" for the rest of the turn',
                gameAction: ability.actions.forRemainderOfTurn({
                    targetController: 'current',
                    match: (card) => card.name === 'Niffle Brute',
                    effect: ability.effects.gainAbility('fight', {
                        gameAction: ability.actions.gainAmber()
                    })
                })
            }
        });
    }
}

NiffleSanctuary.id = 'niffle-sanctuary';

export default NiffleSanctuary;
