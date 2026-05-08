const Card = require('../../Card.js');

class NoxiousIonox extends Card {
    // Entrench.
    // At the start of your turn, if Noxious Ionox is exhausted, destroy an enemy creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onTurnStart: (_, context) =>
                    context.player === this.game.activePlayer && context.source.exhausted
            },
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.destroy()
            },
            effect: 'destroy {0}'
        });
    }
}

NoxiousIonox.id = 'noxious-ionox';

module.exports = NoxiousIonox;
