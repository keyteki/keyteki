const Card = require('../../Card.js');

class SciOfficerMorpheus extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardPlayed: (event, context) => event.card.type === 'creature' && event.player === context.player &&
                    event.card.abilities.reactions.some(ability => ability.properties.name === 'Play' && Object.keys(ability.when).some(key => key === 'onCardPlayed'))
            },
            effect: 'trigger the play effect of {1} an​ additional time',
            effectArgs: context => context.event.card,
            gameAction: ability.actions.resolveAbility(context => ({
                ability: context.event.card.abilities.reactions.find(ability => ability.properties.name === 'Play' &&
                    Object.keys(ability.when).some(key => key === 'onCardPlayed'))
            }))
        });
    }
}

SciOfficerMorpheus.id = 'sci-officer-morpheus';

module.exports = SciOfficerMorpheus;
