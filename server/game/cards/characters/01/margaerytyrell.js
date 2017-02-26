const DrawCard = require('../../../drawcard.js');

class MargaeryTyrell extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel this character to give another +3 STR',
            cost: ability.costs.kneelSelf(),
            method: 'kneel'
        });
    }

    kneel(player) {
        if(this.controller !== player || player.phase !== 'challenge') {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            source: this,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character',
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;
    }

    onCardSelected(player, card) {
        this.game.addMessage('{0} kneels {1} to give {2} +3 STR until the end of the phase', player, this, card);
        this.untilEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.modifyStrength(3)
        }));

        return true;
    }
}

MargaeryTyrell.code = '01181';

module.exports = MargaeryTyrell;
