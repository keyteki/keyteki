const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class KnowTheWorld extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Switch a claimed ring with an unclaimed one',
            condition: () => _.any(this.game.rings, ring => ring.claimedBy === this.controller.name) && _.any(this.game.rings, ring => !ring.claimed && !ring.contested),
            handler: () => {
                this.game.promptForRingSelect(this.controller, {
                    source: this,
                    activePromptTitle: 'Choose a ring to return',
                    ringCondition: ring => ring.claimedBy === this.controller.name,
                    onSelect: (player, ringToReturn) => {
                        this.game.promptForRingSelect(player, {
                            source: this,
                            activePromptTitle: 'Choose a ring to take',
                            ringCondition: ring => !ring.claimed && !ring.contested,
                            onSelect: (player, ring) => {
                                this.game.addMessage('{0} plays {1}, returning the {2} ring and taking the {3} ring', player, this, ringToReturn.element, ring.element);
                                if(this.controller.allowGameAction('takeFateFromRings')) {
                                    this.game.addFate(player, ring.fate);
                                    ring.removeFate();
                                }
                                ring.claimRing(player);
                                ringToReturn.resetRing();
                                return true;
                            }
                        });
                        return true;
                    }
                });
            }
        });
    }
}

KnowTheWorld.id = 'know-the-world';

module.exports = KnowTheWorld;
