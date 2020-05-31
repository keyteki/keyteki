const Card = require('../../Card.js');

class StormCrawler extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.limitFightDamage(1)
        });
        this.reaction({
            when: {
                onReap: (event, context) =>
                    event.card.type === 'creature' &&
                    event.card.controller !== context.source.controller
            },
            gameAction: ability.actions.stun((context) => ({
                target: context.event.card
            }))
        });
    }
}

StormCrawler.id = 'storm-crawler';

module.exports = StormCrawler;
