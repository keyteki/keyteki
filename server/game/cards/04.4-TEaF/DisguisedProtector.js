const DrawCard = require('../../drawcard.js');

class DisguisedProtector extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.action({
            title: 'Add each players honor bid to their skill total',
            condition: context => context.source.isParticipating(),
            effect: 'add the bid on each players dial to their skill total',
            gameAction: [
                ability.actions.playerLastingEffect(context => ({
                    duration: 'untilEndOfConflict',
                    //target: context.player,
                    effect: ability.effects.changePlayerSkillModifier(context.player.showBid)
                })),
                ability.actions.playerLastingEffect(context => ({
                    duration: 'untilEndOfConflict',
                    //target: context.player.opponent,
                    targetController: 'opponent',
                    effect: ability.effects.changePlayerSkillModifier(context.player.opponent.showBid)
                }))
            ]
        });
    }
}

DisguisedProtector.id = 'disguised-protector';

module.exports = DisguisedProtector;
