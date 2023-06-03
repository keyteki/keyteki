const Card = require('../../Card.js');

//  This creature gains, "Action: Make a token creature for each of this creature`s non-Star Alliance neighbors"
class Uplink extends Card {
    /*
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('action', {
                gameAction: ability.actions.makeTokenCreature((context) => ({
                    amount: context.source.neighbors.filter(
                        (card) => !card.hasHouse('staralliance')
                    ).length
                }))
            })
        });
    }
    */
    /*
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('action', {
                target: {
                    gameAction: ability.actions.makeTokenCreature()
                }
            })
        });
    }
    */
    /*
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('action', {
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.swap()
                },
                effect: 'swap its position with {0}. You may use {0} this turn',
                gameAction: ability.actions.forRemainderOfTurn((abilityContext) => ({
                    effect: ability.effects.canUse((card) => card === abilityContext.target)
                }))
            })
        });
    }
    */
    /*
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('action', {
                gameAction: ability.actions.makeTokenCreature()
            })
        });
    }
*/
    /*
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('action', {
                gameAction: ability.actions.makeTokenCreature((context) => ({
                    amount: context.source.neighbors.filter(
                        (card) => !card.hasHouse('staralliance')
                    ).length
                }))
            })
        });
    }*/

    /*
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('action', {
                gameAction: ability.actions.makeTokenCreature({ amount: 2 })
            })
        });
    }
    */

    /*
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('action', {
                gameAction: ability.actions.makeTokenCreature((context) => ({
                    amount: context.player.creaturesInPlay.length
                }))
            })
        });
    }
    */

    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('action', {
                gameAction: ability.actions.makeTokenCreature((context) => ({
                    amount: context.source.neighbors.filter(
                        (card) => !card.hasHouse('staralliance')
                    ).length
                }))
            })
        });
    }
}

Uplink.id = 'uplink';

module.exports = Uplink;
