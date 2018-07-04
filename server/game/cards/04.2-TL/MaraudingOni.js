const DrawCard = require('../../drawcard.js');

class MaraudingOni extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: [
                ability.effects.cardCannot('honor'),
                ability.effects.cardCannot('dishonor')
            ]
        });

        this.forcedReaction({
            title: 'Lose honor when declared as attacker or defender',
            when: {
                onConflictDeclared: (event, context) => context.source.isAttacking(),
                onDefendersDeclared: (event, context) => context.source.isDefending()
            },
            gameAction: ability.actions.loseHonor(context => ({ target: context.player })),
            limit: ability.limit.unlimitedPerConflict()
        });
    }
}

MaraudingOni.id = 'marauding-oni';

module.exports = MaraudingOni;
