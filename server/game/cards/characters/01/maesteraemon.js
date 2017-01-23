const DrawCard = require('../../../drawcard.js');

class MaesterAemon extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event, player, card, allowSaves) => (
                    allowSaves &&
                    !this.kneeled &&
                    card.getFaction() === 'thenightswatch' &&
                    card.controller === this.controller
                )
            },
            canCancel: true,
            title: context => 'Use ' + this.name + ' to save ' + context.event.params[2].name,
            handler: context => {
                context.cancel();
                this.game.addMessage('{0} kneels {1} to save {2}', this.controller, this, context.event.params[2]);

                this.controller.kneelCard(this);
            }
        });
    }
}

MaesterAemon.code = '01125';

module.exports = MaesterAemon;
