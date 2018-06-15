const DrawCard = require('../../drawcard.js');

class IkomaTsanuri extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give your characters +1/+1',
            condition: context => context.source.isParticipating() &&
                                  context.player.cardsInPlay.filter(card => card.isParticipating() && card.hasTrait('bushi')).length > 2,
            effect: 'grant their participating characters +1{1}/+1{2}',
            effectArgs: () => ['military', 'political'],
            gameAction: ability.actions.cardLastingEffect(context => ({
                target: context.player.cardsInPlay.filter(card => card.isParticipating()),
                effect: ability.effects.modifyBothSkills(1)
            }))
        });
    }
}

IkomaTsanuri.id = 'ikoma-tsanuri';

module.exports = IkomaTsanuri;
