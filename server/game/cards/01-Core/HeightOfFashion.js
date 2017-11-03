const DrawCard = require('../../drawcard.js');

class HeightOfFashion extends DrawCard {
    canPlay() {
        if(this.game.currentConflict) {
            return false;
        }
        return super.canPlay();
    }
}

HeightOfFashion.id = 'height-of-fashion';

module.exports = HeightOfFashion;
