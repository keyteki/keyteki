const Card = require('../../Card.js');

class Infomancer extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                location: 'hand',
                controller: 'self',
                cardType: 'action',
                gameAction: ability.actions.graft({ parent: this })
            }
        });

        this.reap({
            target: {
                location: 'any',
                controller: 'self',
                cardType: 'action',
                cardCondition: card => card.parent === this && card.facedown === false
            },
            gameAction: ability.actions.resolveAbility(context => ({
                ability: context.target && context.target.abilities.reactions.find(ability => ability.properties.name === 'Play')
            }))
        });
    }
}

Infomancer.id = 'infomancer';

module.exports = Infomancer;
