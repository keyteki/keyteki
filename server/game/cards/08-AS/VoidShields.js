import Card from '../../Card.js';

class VoidShields extends Card {
    // This creature gains, “At the end of your turn, ward this creature.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('interrupt', {
                when: {
                    onRoundEnded: (_, context) => context.player === this.game.activePlayer
                },
                gameAction: ability.actions.ward()
            })
        });
    }
}

VoidShields.id = 'void-shields';

export default VoidShields;
