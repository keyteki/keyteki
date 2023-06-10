const Card = require('../../Card.js');

class CyberClone extends Card {
    // Play: Purge another creature. Until Cyber-Clone leaves play, it has power equal to the purged creatures power, and gains that creatures armor, keywords, and traits.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: (card, context) => card !== context.source,
                location: 'play area',
                gameAction: ability.actions.sequential([
                    ability.actions.purge((context) => {
                        context.event.targetClone = context.target.getBottomCard().createSnapshot();
                        return {
                            context: context.target
                        };
                    }),
                    ability.actions.cardLastingEffect((context) => {
                        let clone = context.event.targetClone;

                        let effects = [
                            ability.effects.modifyPower(clone.getPower(true) - 1),
                            ability.effects.modifyArmor(clone.getArmor(true))
                        ];
                        effects = effects.concat(
                            clone.getTraits(true).map((trait) => ability.effects.addTrait(trait))
                        );
                        effects = effects.concat(
                            Object.keys(clone.printedKeywords).map((keyword) =>
                                ability.effects.addKeyword({
                                    [keyword]: clone.printedKeywords[keyword]
                                })
                            )
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
