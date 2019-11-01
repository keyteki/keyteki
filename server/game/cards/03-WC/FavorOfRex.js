const Card = require('../../Card.js');

class FavorOfRex extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'any',
                cardType: 'creature',
                gameAction: ability.actions.resolveAbility(context => {
                    return { ability: context.target ? context.target.abilities.reactions.find(ability => ability.properties.name === 'Play') : null };
                })
            },
            effect: 'trigger play effect of {0}'
        });
    }
}

FavorOfRex.id = 'favor-of-rex';

module.exports = FavorOfRex;
