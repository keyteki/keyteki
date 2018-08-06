const DrawCard = require('../../drawcard.js');

class BrashSamurai extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Honor this character',
            condition: context =>
                context.source.isParticipating() &&
                this.game.currentConflict.getNumberOfParticipantsFor(context.source.controller) === 1,
            gameAction: ability.actions.honor()
        });
    }
}

BrashSamurai.id = 'brash-samurai';

module.exports = BrashSamurai;
