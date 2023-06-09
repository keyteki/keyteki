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
                    event.fightEvent.attackerClone.hasHouse('brobnar') &&
                    event.fightEvent.card !== context.source &&
                    event.fightEvent.attacker !== context.source &&
                    event.fightEvent.attackerClone !== context.source
            },
            gameAction: ability.actions.gainAmber({ amount: 1 })
        });
    }
}

BrikkNastee.id = 'brikk-nastee';

module.exports = BrikkNastee;
