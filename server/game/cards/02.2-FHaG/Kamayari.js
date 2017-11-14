const DrawCard = require('../../drawcard.js');

class Kamayari extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Bow character who triggered ability',
            when: {
                
            }
        })
    }
}

Kamayari.id = 'kamayari';

module.exports = Kamayari;
