const DrawCard = require('../../drawcard.js');

class SakeHouseConfidant extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give Shinobi +2 political',
            condition: context => context.source.isParticipating(),
            cost: ability.costs.discardImperialFavor(),
            effect: 'give their Shinobi +0/+2',
            gameAction: ability.actions.cardLastingEffect(context => ({
                target: context.player.cardsInPlay.filter(card => card.hasTrait('shinobi')),
                effect: ability.effects.modifyPoliticalSkill(2)
            }))
        });
    }
}

SakeHouseConfidant.id = 'sake-house-confidant';

module.exports = SakeHouseConfidant;
