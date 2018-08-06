const DrawCard = require('../../drawcard.js');

class UnleashTheDjinn extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Make all participating characters 3/3',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.payHonor(3),
            gameAction: ability.actions.cardLastingEffect(context => ({
                target: context.game.currentConflict.getParticipants(),
                effect: [
                    ability.effects.setMilitarySkill(3),
                    ability.effects.setPoliticalSkill(3)
                ]
            })),
            effect: 'make all participating characters 3{1}/3{2}',
            effectArgs: () => ['military', 'political']
        });
    }
}

UnleashTheDjinn.id = 'unleash-the-djinn';

module.exports = UnleashTheDjinn;
