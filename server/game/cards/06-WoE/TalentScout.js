const Card = require('../../Card.js');

class TalentScout extends Card {
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
            }
        });
    }
}

TalentScout.id = 'talent-scout';

module.exports = TalentScout;
