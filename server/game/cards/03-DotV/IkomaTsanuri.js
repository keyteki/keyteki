const DrawCard = require('../../drawcard.js');

class IkomaTsanuri extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give your characters +1/+1',
            condition: context => context.source.isParticipating() && context.player.cardsInPlay.filter(card => card.isParticipating() && card.hasTrait('bushi')).length > 2,
            handler: context => {
                this.game.addMessage('{0} uses {1}, granting his participating characters +1/+1', context.player, context.source);
                context.player.cardsInPlay.each(card => {
                    if(card.isParticipating()) {
                        this.untilEndOfConflict(ability => ({
                            match: card,
                            effect: [
                                ability.effects.modifyPoliticalSkill(1),
                                ability.effects.modifyMilitarySkill(1)
                            ]
                        }));
                    }
                });
            }
        });
    }
}

IkomaTsanuri.id = 'ikoma-tsanuri';

module.exports = IkomaTsanuri;
