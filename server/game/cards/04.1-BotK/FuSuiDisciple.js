const DrawCard = require('../../drawcard.js');

class FuSuiDisciple extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Honor or dishonor a character controlled by a player with the air ring',
            targets: {
                player: {
                    mode: 'select',
                    activePromptTitle: 'Choose a player',
                    choices: {
                        'Me': context => context.game.rings.air.isConsideredClaimed(context.player),
                        'My Opponent': context => context.game.rings.air.isConsideredClaimed(context.player.opponent)
                    }
                },
                character: {
                    dependsOn: 'player',
                    player: context => context.selects.player.choice === 'Me' ? 'self' : 'opponent',
                    activePromptTitle: 'Choose a character to be honored or dishonored',
                    cardType: 'character',
                    cardCondition: (card, context) => {
                        let player = context.selects.player.choice === 'Me' ? context.player : context.player.opponent;
                        return !card.isHonored && !card.isDishonored && card.controller === player;
                    }
                },
                effect: {
                    dependsOn: 'character',
                    mode: 'select',
                    choices: {
                        'Honor this character': ability.actions.honor(context => ({ target: context.targets.character })),
                        'Dishonor this character': ability.actions.dishonor(context => ({ target: context.targets.character }))
                    }
                }
            }
        });
    }
}

FuSuiDisciple.id = 'fu-sui-disciple';

module.exports = FuSuiDisciple;
