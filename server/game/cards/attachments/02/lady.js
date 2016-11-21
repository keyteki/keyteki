const DrawCard = require('../../../drawcard.js');
 
class Lady extends DrawCard {
    canAttach(player, card) {
        if(card.getFaction() !== this.getFaction()) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Lady.code = '02004';

module.exports = Lady;
