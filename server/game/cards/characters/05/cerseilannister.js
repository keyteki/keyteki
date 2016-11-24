const DrawCard = require('../../../drawcard.js');
 
class CerseiLannister extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);
        
        this.registerEvents(['onAttackersDeclared']);
    }

    onAttackersDeclared(player, challengeType) {
        if(!this.inPlay || this.owner !== player || challengeType !== 'intrigue') {
            return;
        }

        if(!this.isBlank()) {
            this.kneeled = false;
        }
    }
}

CerseiLannister.code = '05001';

module.exports = CerseiLannister;
