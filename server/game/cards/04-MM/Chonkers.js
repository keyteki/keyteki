const Card = require('../../Card.js');

class Chonkers extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) =>
                    event.damageSource === context.source &&
                    event.destroyEvent &&
                    event.destroyEvent.resolved
            },
            gameAction: [ability.actions.addPowerCounter((context) => (
                {amount: context.source.tokens.power} 
            ))]
        });

        this.play({
            effect: 'add 1 power counter to each other friendly untamed creature',
            gameAction: ability.actions.addPowerCounter({amount: 1})
            
        });
        
        // console.log(this);
    }
}

Chonkers.id = 'chonkers';

module.exports = Chonkers;
