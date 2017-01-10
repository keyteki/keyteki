const DrawCard = require('../../../drawcard.js');

class BreienneOfTarth extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDefendersDeclared']);
    }

    onDefendersDeclared(event, challenge) {
        var player = challenge.defendingPlayer;

        if(this.isBlank() || this.controller !== player) {
            return;
        }

        if(player.cardsInPlay.any(card => {
            return card.hasTrait('King') || card.name === 'Catelyn Stark';
        })) {
            player.standCard(this);
        }
    }
}

BreienneOfTarth.code = '04083';

module.exports = BreienneOfTarth;
