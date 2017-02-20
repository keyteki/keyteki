const DrawCard = require('../../../drawcard.js');

class DirewolfPup extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card === this,
            effect: ability.effects.dynamicStrength(() => this.calculateStrength(this.controller.cardsInPlay))
        });
    }

    isOtherDirewolf(card) {
        return card.uuid === this.uuid || !card.hasTrait('Direwolf');
    }

    calculateStrength(list) {
        return list.reduce((counter, card) => {
            var attachmentStr = this.calculateStrength(card.attachments);

            if(this.isOtherDirewolf(card)) {
                return counter + attachmentStr;
            }

            return counter + attachmentStr + 1;
        }, 0);
    }
}

DirewolfPup.code = '01149';

module.exports = DirewolfPup;
