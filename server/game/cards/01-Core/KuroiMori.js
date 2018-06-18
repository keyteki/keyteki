const _ = require('underscore');
const ProvinceCard = require('../../provincecard.js');

class KuroiMori extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Switch the conflict type or ring',
            condition: context => context.source.isConflictProvince(),
            target: {
                player: 'self',
                mode: 'select',
                choices: {
                    'Switch the contested ring': () => _.any(this.game.rings, ring => ring.isUnclaimed()),
                    'Switch the conflict type': () => true
                }
            },
            effect: '{1}',
            effectArgs: context => context.select.toLowerCase(),
            handler: context => {
                if(context.select === 'Switch the contested ring') {
                    this.game.promptForRingSelect(context.player, {
                        context: context,
                        ringCondition: ring => ring.isUnclaimed(),
                        onSelect: (player, ring) => {
                            this.game.addMessage('{0} switches the conflict ring to {1}', player, ring);
                            this.game.currentConflict.switchElement(ring.element);
                            return true;
                        }
                    });
                } else {
                    this.game.currentConflict.switchType();
                }
            }
        });
    }
}

KuroiMori.id = 'kuroi-mori';

module.exports = KuroiMori;
