const Card = require('../../Card.js');

class TalentScout extends Card {
    // Talent Scout may be used as if it belonged to the active house.
    // Play: Look at your opponent's hand and play a creature from it as if it were yours. Your opponent takes control of Talent Scout.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardCondition: (card) => card.type === 'creature',
                controller: 'opponent',
                revealTargets: true,
                location: 'hand',
                gameAction: ability.actions.sequential([
                    ability.actions.playCard(),
                    ability.actions.cardLastingEffect((context) => ({
                        duration: 'lastingEffect',
                        target: this,
                        effect: ability.effects.takeControl(context.player.opponent)
                    }))
                ])
            },
            effect:
                "look at opponent's hand and play a creature, and give control of {1} to opponent",
            effectArgs: (context) => context.source
        });
    }
}

TalentScout.id = 'talent-scout';

module.exports = TalentScout;
