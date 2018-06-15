const DrawCard = require('../../drawcard.js');

class CourtGames extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Honor or dishonor a character',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'political',
            max: ability.limit.perConflict(1),
            target: {
                player: 'self',
                mode: 'select',
                choices: {
                    'Honor a friendly character': ability.actions.honor(context => ({
                        promptForSelect: {
                            cardType: 'character',
                            controller: 'self',
                            cardCondition: card => card.isParticipating() && card.allowGameAction('target', context),
                            message: '{0} chooses to honor {1}'
                        }
                    })),
                    'Dishonor an opposing character': ability.actions.dishonor(context => ({
                        promptForSelect: {
                            player: context.player.opponent,
                            cardType: 'character',
                            controller: 'opponent',
                            cardCondition: card => card.isParticipating() && card.allowGameAction('target', context),
                            message: '{0} chooses to dishonor {1}'
                        }
                    }))
                }
            },
            effect: '{0}',
            effectArgs: context => context.select.toLowerCase()
        });
    }
}

CourtGames.id = 'court-games';

module.exports = CourtGames;

