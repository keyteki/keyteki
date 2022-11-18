const Card = require('../../Card.js');

class BrikkNastee extends Card {
    //After another friendly Brobnar creature fights, gain 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onUseCard: (event, context) =>
                    event.fightEvent &&
                    event.fightEvent.attackerClone.controller === context.player &&
                    event.fightEvent.attackerClone.type === 'creature' &&
                    event.fightEvent.attackerClone !== context.source &&
                    event.fightEvent.attackerClone.hasHouse('brobnar')
            },
            gameAction: ability.actions.gainAmber({ amount: 1 })
        });
    }
}

BrikkNastee.id = 'brikk-nastee';

module.exports = BrikkNastee;
