const DrawCard = require('../../drawcard.js');

class KuniLaboratory extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === 'character',
            effect: ability.effects.modifyBothSkills(1)
        });

        this.forcedReaction({
            title: 'After the conflict phase begins',
            when: {
                onPhaseStarted: event => event.phase === 'conflict'
            },
            effect: 'lose an honor',
            gameAction: ability.actions.loseHonor(context => ({ target: context.player }))
        });
    }
}

KuniLaboratory.id = 'kuni-laboratory';

module.exports = KuniLaboratory;
