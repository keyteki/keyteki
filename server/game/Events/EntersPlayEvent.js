const Event = require('./Event.js');

class EntersPlayEvent extends Event {
    constructor(params, card, fate, gameAction) {
        super('onCharacterEntersPlay', params);
        this.handler = this.entersPlay;
        this.card = card;
        this.fate = fate;
        this.gameAction = gameAction;
        this.originalLocation = card.location;
    }

    entersPlay() {
        this.card.new = true;
        this.context.player.moveCard(this.card, 'play area');
    }
}

module.exports = EntersPlayEvent;
