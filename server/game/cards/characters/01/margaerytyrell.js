const DrawCard = require('../../../drawcard.js');

class MargaeryTyrell extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel this character to give another +3 STR',
            method: 'kneel'
        });
    }

    kneel(player) {
        if(this.controller !== player || this.kneeled || player.phase !== 'challenge') {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character',
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;
    }

    onCardSelected(player, card) {
        this.game.addMessage('{0} kneels {1} to give {2} +3 STR until the end of the phase', player, this, card);
        this.controller.kneelCard(this);
        this.untilEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.modifyStrength(3)
        }));

        return true;
    }
}

MargaeryTyrell.code = '01181';

module.exports = MargaeryTyrell;
