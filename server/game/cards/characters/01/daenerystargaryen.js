const DrawCard = require('../../../drawcard.js');

class DaenerysTargaryen extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.kneeled && this.game.currentChallenge,
            match: card => this.game.currentChallenge.isParticipating(card) && card.getType() === 'character',
            targetController: 'opponent',
            effect: ability.effects.modifyStrength(-1),
            recalculateWhen: ['onCardStood', 'onCardKneeled', 'onAttackersDeclared', 'onDefendersDeclared']
        });
    }
}

DaenerysTargaryen.code = '01160';

module.exports = DaenerysTargaryen;
