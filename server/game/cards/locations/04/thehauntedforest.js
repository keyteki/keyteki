const DrawCard = require('../../../drawcard.js');

class TheHauntedForest extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDefendersDeclared']);
    }

    onDefendersDeclared(event, challenge) {
        if(challenge.defendingPlayer !== this.controller || this.isBlank() || this.kneeled) {
            return;
        }

        challenge.modifyDefenderStrength(1);
        this.game.addMessage('{0} uses {1} to add 1 to the strength of this {2} challenge', this.controller, this, challenge.challengeType);
    }    
    
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (e, challenge) => this.controller === challenge.loser && !this.kneeled
            },
            handler: () => {
                this.game.addMessage('{0} is forced to kneel {1} because they lost a challenge', this.controller, this);
                this.controller.kneelCard(this);
            }
        });
    }
}

TheHauntedForest.code = '04066';

module.exports = TheHauntedForest;
