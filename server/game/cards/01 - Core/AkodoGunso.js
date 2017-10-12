const DrawCard = require('../../drawcard.js');

class AkodoGunso extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                'onCardEntersPlay': event => event.card === this
            },
            handler: context => {
                this.game.addMessage('{0} uses {1}\'s ability to refill the province face up', this.controller, this);
                let province = this.controller.getSourceList(context.event.originalLocation);
                let card = province.find(card => card.isDynasty);
                card.facedown = false;
            }
        });
    }
}

AkodoGunso.id = 'akodo-gunso';

module.exports = AkodoGunso;
