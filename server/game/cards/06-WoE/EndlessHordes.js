const Card = require('../../Card.js');

class EndlessHordes extends Card {
    // Play: For each enemy creature, make a token creature, ready it,
    // and have it fight that enemy creature, ignoring taunt. Resolve
    // these fights one at a time.
    //
    // Note the FAQ entry states that all the tokens are created first,
    // then all readied, then fight targets are chosen one at a time and
    // the fights are fully resolved.
    //
    // Unofficial ruling from blinkingline is that only enemy
    // creatures that were present at the beginning of resolution can
    // be targeted for later fighting.  If multiple creatures are
    // killed during one fight, then the leftover tokens just end up
    // ready (even if new creatures were created during earlier
    // fights).
    setupCardAbilities(ability) {
        this.validTargets = [];
        this.newTokens = [];

        this.play({
            gameAction: ability.actions.makeTokenCreature((context) => {
                this.validTargets = context.player.opponent.creaturesInPlay.slice();
                return {
                    amount: this.validTargets.length
                };
            }),
            then: {
                gameAction: ability.actions.sequential([
                    ability.actions.sequentialForEach((context) => {
                        this.newTokens = context.preThenEvent.cards;
                        return {
                            forEach: this.newTokens,
                            action: ability.actions.ready()
                        };
                    }),
                    ability.actions.sequentialForEach(() => ({
                        forEach: this.newTokens,
                        action: ability.actions.cardLastingEffect({
                            effect: ability.effects.ignores('taunt')
                        })
                    }))
                ]),
                then: {
                    gameAction: ability.actions.sequentialForEach(() => ({
                        forEach: this.newTokens,
                        action: ability.actions.fight({
                            fightCardCondition: (card) => {
                                return this.validTargets.includes(card);
                            },
                            resolveFightPostHandler: (_, action) => {
                                if (action.target.length === 0) {
                                    return;
                                }

                                const index = this.validTargets.findIndex(
                                    (card) => card.name == action.target[0].name
                                );
                                if (index > -1) {
                                    this.validTargets.splice(index, 1);
                                }
                            }
                        })
                    })),
                    then: {
                        alwaysTriggers: true,
                        gameAction: ability.actions.sequentialForEach(() => ({
                            forEach: this.newTokens,
                            action: ability.actions.cardLastingEffect({
                                effect: ability.effects.cancelIgnores('taunt')
                            })
                        }))
                    }
                }
            }
        });
    }
}

EndlessHordes.id = 'endless-hordes';

module.exports = EndlessHordes;
