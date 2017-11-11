const _ = require('underscore');
const ProvinceCard = require('../../provincecard.js');

class KuroiMori extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Switch the conflict type or ring',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictProvince === this,
            target: {
                player: 'self',
                mode: 'select',
                choices: {
                    'Switch the contested ring': () => _.any(this.game.rings, ring => !ring.claimed && !ring.contested),
                    'Switch the conflict type': () => true
                }
            },
            source: this,
            handler: context => {
                if(context.select === 'Switch the contested ring') {
                    this.game.promptForRingSelect(this.controller, {
                        ringCondition: ring => !ring.contested && !ring.claimed,
                        onSelect: (player, ring) => {
                            this.game.addMessage('{0} uses {1} to switch the conflict ring to {2}', player, this, ring.element);
                            this.game.currentConflict.switchElement(ring.element);
                            return true;
                        }
                    });
                } else {
                    this.game.currentConflict.switchType();
                    this.game.addMessage('{0} uses {1} to switch the conflict type to {2}', this.controller, this, this.game.currentConflict.conflictType);
                }
            }
        });
    }
}

KuroiMori.id = 'kuroi-mori';

module.exports = KuroiMori;
