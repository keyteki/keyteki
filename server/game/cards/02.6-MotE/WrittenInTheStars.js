const DrawCard = require('../../drawcard.js');

class WrittenInTheStars extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Place or take fate from rings',
            target: {
                mode: 'select',
                choices: {
                    'Place one fate on each unclaimed ring with no fate': ability.actions.placeFateOnRing(() => ({
                        target: Object.values(this.game.rings).filter(ring => ring.isUnclaimed() && ring.fate === 0)
                    })),
                    'Remove one fate from each unclaimed ring': ability.actions.takeFateFromRing(() => ({
                        target: Object.values(this.game.rings).filter(ring => ring.isUnclaimed() && ring.fate > 0)
                    }))
                }
            }
        });
    }
}

WrittenInTheStars.id = 'written-in-the-stars';

module.exports = WrittenInTheStars;
