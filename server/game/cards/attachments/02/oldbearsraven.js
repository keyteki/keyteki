const DrawCard = require('../../../drawcard.js');

class OldBearsRaven extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            match: card => card.name === 'Old Bear Mormont',
            effect: ability.effects.addIcon('intrigue')
        });
        this.whileAttached({
            effect: ability.effects.addKeyword('stealth')
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character') {
            return false;
        }
        return super.canAttach(player, card);
    }
}

OldBearsRaven.code = '02106';

module.exports = OldBearsRaven;
