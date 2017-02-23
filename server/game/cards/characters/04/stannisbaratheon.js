const DrawCard = require('../../../drawcard.js');

class StannisBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'power'),
            match: (card) => this.game.currentChallenge.isParticipating(card) && !card.hasTrait('King'),
            targetController: 'any',
            effect: ability.effects.modifyStrength(-1)
        });
/*
        this.reaction({
            when: {
                onDominanceDetermined: (event, winner) => this.controller === winner
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => (
                        card.location === 'play area' && 
                        card.getType() === 'character' && 
                        !card.isLoyal()),
                    activePromptTitle: 'Select a character',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    onSelect: (player, card) => {
                        this.game.addMessage('{0} has chosen {1} as the target for {2}\'s ability', player, card, this);
                    }
                });
            }
        }); */
    }
}

StannisBaratheon.code = '04067';

module.exports = StannisBaratheon;
