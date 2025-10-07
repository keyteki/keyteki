import Card from '../../Card.js';

class OxSarbane extends Card {
    // Each enemy creature gains, "After Fight/After Reap: Exhaust each friendly creature that shares a house with this creature."
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            match: (card) => card.type === 'creature',
            effect: [
                ability.effects.gainAbility('fight', {
                    gameAction: ability.actions.exhaust((context) => ({
                        target: context.player.creaturesInPlay.filter((card) =>
                            context.source.getHouses().some((house) => card.hasHouse(house))
                        )
                    }))
                }),
                ability.effects.gainAbility('reap', {
                    gameAction: ability.actions.exhaust((context) => ({
                        target: context.player.creaturesInPlay.filter((card) =>
                            context.source.getHouses().some((house) => card.hasHouse(house))
                        )
                    }))
                })
            ]
        });
    }
}

OxSarbane.id = 'ox-sarbane';

export default OxSarbane;
