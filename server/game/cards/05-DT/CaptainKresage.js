import Card from '../../Card.js';

class CaptainKresage extends Card {
    // While you control another creature with elusive, taunt, poison, or skirmish, Captain Kresage gains that keyword.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.player.creaturesInPlay.some(
                    (card) =>
                        card !== context.source &&
                        card.type === 'creature' &&
                        card.hasKeyword('elusive')
                ),
            effect: ability.effects.addKeyword({ elusive: 1 })
        });

        this.persistentEffect({
            condition: (context) =>
                context.player.creaturesInPlay.some(
                    (card) =>
                        card !== context.source &&
                        card.type === 'creature' &&
                        card.hasKeyword('skirmish')
                ),
            effect: ability.effects.addKeyword({ skirmish: 1 })
        });

        this.persistentEffect({
            condition: (context) =>
                context.player.creaturesInPlay.some(
                    (card) =>
                        card !== context.source &&
                        card.type === 'creature' &&
                        card.hasKeyword('taunt')
                ),
            effect: ability.effects.addKeyword({ taunt: 1 })
        });

        this.persistentEffect({
            condition: (context) =>
                context.player.creaturesInPlay.some(
                    (card) =>
                        card !== context.source &&
                        card.type === 'creature' &&
                        card.hasKeyword('poison')
                ),
            effect: ability.effects.addKeyword({ poison: 1 })
        });
    }
}

CaptainKresage.id = 'captain-kresage';

export default CaptainKresage;
