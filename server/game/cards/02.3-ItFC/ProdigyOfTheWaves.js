const DrawCard = require('../../drawcard.js');

class ProdigyOfTheWaves extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready this character',
            condition: context => context.source.allowGameAction('ready', context) && this.game.rings['water'].claimed,
            handler: context => {
                this.game.addMessage('{0} readies {1} using its ability', this.controller, this);
                this.game.applyGameAction(context, { ready: context.source });
            }
        });
    }
}

ProdigyOfTheWaves.id = 'prodigy-of-the-waves';

module.exports = ProdigyOfTheWaves;
