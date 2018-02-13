const Event = require('./Event.js');

class EntersPlayEvent extends Event {
    constructor(params) {
        super('onCardEntersPlay', params);
        this.handler = this.entersPlay;
        this.originalLocation = this.card.location;
    }
    
    entersPlay() {
        this.card.new = true;
        if(this.fate) {
            this.card.fate = this.fate;
        }
        if(this.card.type === 'character') {
            this.context.player.moveCard(this.card, 'play area');
        }
        this.card.controller = this.context.player;

        if(this.intoConflict) {
            if(this.context.player.isAttackingPlayer()) {
                this.context.game.currentConflict.addAttacker(this.card);
            } else {
                this.context.game.currentConflict.addDefender(this.card);
            }
        }
    }
}

module.exports = EntersPlayEvent;
