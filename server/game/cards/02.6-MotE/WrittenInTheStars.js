const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class WrittenInTheStars extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Place or take fate from rings',
            target: {
                player: 'self',
                mode: 'select',
                choices: {
                    'Place one fate on each unclaimed ring with no fate': () => _.any(this.game.rings, ring => {
                        return ring.isUnclaimed() && ring.getFate() === 0;
                    }),
                    'Remove one fate from each unclaimed ring': () => this.controller.allowGameAction('takeFateFromRings') && _.any(this.game.rings, ring => {
                        return ring.isUnclaimed() && ring.getFate() > 0;
                    })
                }
            },
            handler: context => {
                let ringsChanged = [];
                if(context.select === 'Place one fate on each unclaimed ring with no fate') {
                    _.each(this.game.rings, ring => {
                        if(ring.isUnclaimed() && ring.getFate() === 0) {
                            ring.modifyFate(1);
                            ringsChanged.push(ring.element);
                        }
                    });
                    this.game.addMessage('{0} adds a fate to the {1} ring(s)', this.controller, ringsChanged);
                } else {
                    _.each(this.game.rings, ring => {
                        if(ring.isUnclaimed() && ring.getFate() > 0) {
                            ring.modifyFate(-1);
                            ringsChanged.push(ring.element);
                        }
                    });
                    this.game.addMessage('{0} removes a fate from the {1} ring(s)', this.controller, ringsChanged);
                }
            }
        });
    }
}

WrittenInTheStars.id = 'written-in-the-stars';

module.exports = WrittenInTheStars;
