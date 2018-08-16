const Card = require('../../Card.js');

class RocketBoots extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('fight', {
                reap: true,
                condition: context => context.game.cardsUsed.filter(card => card === context.source.parent).length === 1,
                gameAction: ability.actions.ready(context => ({ target: context.source.parent }))
            })
        });
    }
}

RocketBoots.id = 'rocket-boots'; // This is a guess at what the id might be - please check it!!!

module.exports = RocketBoots;
