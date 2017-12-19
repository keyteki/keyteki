const DrawCard = require('../../drawcard.js');

class HeightOfFashion extends DrawCard {
    canPlay(context) {
        if(this.game.currentConflict) {
            return false;
        }
        return super.canPlay(context);
    }
}

HeightOfFashion.id = 'height-of-fashion';

module.exports = HeightOfFashion;
