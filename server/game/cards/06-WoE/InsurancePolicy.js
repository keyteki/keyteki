import Card from '../../Card.js';

class InsurancePolicy extends Card {
    // Play: Lose 1A. This creature gains, "Destroyed: If it is not
    // your turn, gain 4A."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('destroyed', {
                gameAction: ability.actions.gainAmber((context) => ({
                    target: context.source.controller,
                    amount: context.source.controller === context.game.activePlayer ? 0 : 4
                }))
            })
        });

        this.play({
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.player
            }))
        });
    }
}

InsurancePolicy.id = 'insurance-policy';

export default InsurancePolicy;
