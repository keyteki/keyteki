const Card = require('../../Card.js');

class ReconAgentAspenEvilTwin extends Card {
    // Elusive.
    // After a player raises the tide during their turn, they may deal 3D to a creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onRaiseTide: (event) => event.player === this.game.activePlayer
            },
            optional: true,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 3 })
            }
        });
    }
}

ReconAgentAspenEvilTwin.id = 'recon-agent-aspen-evil-twin';

module.exports = ReconAgentAspenEvilTwin;
