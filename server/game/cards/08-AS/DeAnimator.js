const Card = require('../../Card.js');

class DeAnimator extends Card {
    // Each card that has a mineralize counter on it is considered an
    // artifact and gains, “Action: Destroy this
    // artifact.”
    // Play/After Reap: Put a mineralize counter on a creature.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.hasToken('mineralize'),
            effect: [
                ability.effects.changeType('artifact'),
                ability.effects.gainAbility('action', {
                    gameAction: ability.actions.destroy((context) => ({
                        target: context.source
                    }))
                }),
                ability.effects.customDetachedCard({
                    apply: () => {},
                    unapply: (card, context) => {
                        if (card.type === 'creature' && card.location === 'play area') {
                            this.game.actions.moveToFlank().resolve(card, context);
                        }
                    }
                })
            ]
        });

        this.play({
            reap: true,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.addMineralizeCounter()
            }
        });
    }
}

DeAnimator.id = 'de-animator';

module.exports = DeAnimator;
