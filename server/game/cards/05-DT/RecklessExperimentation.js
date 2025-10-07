import Card from '../../Card.js';

class RecklessExperimentation extends Card {
    // This creature gains, "Reap: Play the top card of your deck."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.playCard((context) => ({
                    revealOnIllegalTarget: true,
                    target: context.player.deck[0]
                }))
            })
        });
    }
}

RecklessExperimentation.id = 'reckless-experimentation';

export default RecklessExperimentation;
