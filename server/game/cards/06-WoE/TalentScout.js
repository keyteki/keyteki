import Card from '../../Card.js';

class TalentScout extends Card {
    // Talent Scout may be used as if it belonged to the active house.
    // Play: Look at your opponent's hand and play a creature from it as if it were yours. Your opponent takes control of Talent Scout.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.canUse(
                (card, context, effectContext) => card === effectContext.source
            )
        });

        this.play({
            target: {
                cardCondition: (card) => card.type === 'creature',
                controller: 'opponent',
                revealTargets: true,
                location: 'hand',
                gameAction: ability.actions.playCard(),
                effect:
                    "look at opponent's hand and play a creature, and give control of {1} to opponent",
                effectArgs: (context) => context.source
            },
            then: {
                alwaysTriggers: true,
                gameAction: [
                    ability.actions.conditional({
                        condition: (context) =>
                            !!context.player.opponent && context.preThenEvents.length === 0,
                        trueGameAction: ability.actions.reveal((context) => ({
                            target: context.player.opponent.hand,
                            chatMessage: true
                        }))
                    }),
                    ability.actions.cardLastingEffect((context) => ({
                        duration: 'lastingEffect',
                        target: this,
                        effect: ability.effects.takeControl(context.player.opponent)
                    }))
                ]
            }
        });
    }
}

TalentScout.id = 'talent-scout';

export default TalentScout;
