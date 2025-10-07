import Card from '../../Card.js';

class Election extends Card {
    // Each creature gains, "After Reap: Put a 'Yea' or 'Nay'
    // counter on Election".
    //
    // If there are 6 'Yea' counters on Election, destroy it and destroy each creature.
    //
    // If there are 6 'Nay' counters on Election, destroy each artifact.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.type === 'creature',
            effect: ability.effects.gainAbility('reap', {
                targets: {
                    action: {
                        mode: 'select',
                        choices: {
                            Yea: ability.actions.addYeaCounter({
                                target: this
                            }),
                            Nay: ability.actions.addNayCounter({
                                target: this
                            })
                        }
                    }
                }
            })
        });

        this.reaction({
            when: {
                onAddToken: () => this.tokens.yea === 6 || this.tokens.nay === 6
            },
            gameAction: ability.actions.destroy((context) => ({
                target:
                    this.tokens.yea === 6
                        ? context.game.creaturesInPlay.concat(this)
                        : context.game.cardsInPlay.filter((card) => card.type === 'artifact')
            }))
        });
    }
}

Election.id = 'election';

export default Election;
