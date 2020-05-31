const Card = require('../../Card.js');

class CyberClone extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: (card, context) => card !== context.source,
                location: 'play area',
                gameAction: ability.actions.sequential([
                    ability.actions.purge((context) => {
                        context.event.targetClone = context.target.createSnapshot();
                        return {
                            context: context.target
                        };
                    }),
                    ability.actions.cardLastingEffect((context) => {
                        let clone = context.event.targetClone;

                        let effects = [
                            ability.effects.modifyPower(clone.power - 1),
                            ability.effects.modifyArmor(clone.armor)
                        ];
                        effects = effects.concat(
                            clone.traits.map((trait) => ability.effects.addTrait(trait))
                        );
                        effects = effects.concat(
                            clone
                                .getEffects('addKeyword')
                                .map((keyword) => ability.effects.addKeyword(keyword))
                        );
                        effects = effects.concat(
                            clone
                                .getEffects('removeKeyword')
                                .map((keyword) => ability.effects.removeKeyword(keyword))
                        );

                        return {
                            target: context.source,
                            duration: 'lastingEffect',
                            effect: effects
                        };
                    })
                ])
            },
            effect: 'purge {0} and copy its power, armor, keywords and traits'
        });
    }
}

CyberClone.id = 'cyber-clone';

module.exports = CyberClone;
