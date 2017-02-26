const DrawCard = require('../../../drawcard.js');

class TheShadowTower extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && challenge.defendingPlayer === this.controller
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.controller !== this.controller,
                    onSelect: (player, card) => {
                        this.game.addMessage('{0} kneels {1} to make {2} unable to be declared as attacker', player, this, card);
                        this.untilEndOfPhase(ability => ({
                            match: card,
                            effect: ability.effects.allowAsAttacker(false)
                        }));
                        
                        return true;
                    }
                });
            }
        });
    }
}

TheShadowTower.code = '03034';

module.exports = TheShadowTower;
