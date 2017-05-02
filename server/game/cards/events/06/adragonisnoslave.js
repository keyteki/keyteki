const DrawCard = require('../../../drawcard.js');

class ADragonIsNoSlave extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give -2 STR',
            phase: 'challenge',
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.attachments.size() === 0
            },
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(-2)
                }));

                this.game.addMessage('{0} uses {1} to give {2} -2 STR until the end of the phase', 
                                      this.controller, this, context.target);
            }
        });

        this.reaction({
            location: 'discard pile',
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && this.hasParticipatingDragonOrDany()
            },
            cost: ability.costs.payGold(1),
            handler: () => {
                this.game.addMessage('{0} pays 1 gold to move {1} back to their hand', this.controller, this);
                this.controller.moveCard(this, 'hand');
            }
        });
    }

    hasParticipatingDragonOrDany() {
        let cards = this.controller.filterCardsInPlay(card => {
            return (this.game.currentChallenge.isParticipating(card) &&
                    (card.hasTrait('Dragon') || card.name === 'Daenerys Targaryen') && 
                    card.getType() === 'character');
        });

        return cards.length >= 1;
    }
}

ADragonIsNoSlave.code = '06034';

module.exports = ADragonIsNoSlave;
