const Card = require('../../Card.js');

class ShadowOfDis extends Card {
    // Play: Until the start of your next turn, each enemy creature’s text box is considered blank (except for traits).
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: "blank {1}'s creatures text boxes",
            effectArgs: (context) => context.player.opponent,
            effectAlert: true,
            gameAction: ability.actions.untilNextTurn({
                targetController: 'opponent',
                match: (card) => card.location === 'play area' && card.type === 'creature',
                effect: ability.effects.blank()
            })
        });
    }
}

ShadowOfDis.id = 'shadow-of-dis';

module.exports = ShadowOfDis;
