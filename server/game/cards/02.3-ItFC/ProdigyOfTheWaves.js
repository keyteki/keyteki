const DrawCard = require('../../drawcard.js');

class ProdigyOfTheWaves extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready this character',
            condition: () => this.bowed && this.game.rings['water'].claimed,
            handler: () => {
                this.game.addMessage('{0} readies {1} using its ability', this.controller, this);
                this.controller.readyCard(this, this);
            }
        });
    }
}

ProdigyOfTheWaves.id = 'prodigy-of-the-waves';

module.exports = ProdigyOfTheWaves;
