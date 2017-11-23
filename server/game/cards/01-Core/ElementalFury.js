const ProvinceCard = require('../../provincecard.js');

class ElementalFury extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Switch the contested ring',
            when: {
                onProvinceRevealed: event => event.province === this
            },
            target: {
                ringCondition: ring => !ring.claimed && !ring.contested,
                mode: 'ring'
            },
            source: this,
            handler: context => {
                this.game.addMessage('{0} uses {1} to change the ring to {2}', this.controller, this, context.ring.element);
                this.game.currentConflict.switchElement(context.ring.element);
            }
        });
    }
}

ElementalFury.id = 'elemental-fury';

module.exports = ElementalFury;
