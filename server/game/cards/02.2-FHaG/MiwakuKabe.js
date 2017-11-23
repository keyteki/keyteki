const DrawCard = require('../../drawcard.js');

class MiwakuKabe extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Shuffle this into deck',
            when: {
                onBreakProvince: event => event.province.controller === this.controller && event.province.location === this.location
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to shuffle itself back into the dynasty deck', this.controller, this);
                this.controller.replaceDynastyCard(this.location);
                this.controller.moveCard(this, 'dynasty deck');
                this.game.queueSimpleStep(() => this.controller.shuffleDynastyDeck());
            }
        });
    }
}

MiwakuKabe.id = 'miwaku-kabe';

module.exports = MiwakuKabe;
