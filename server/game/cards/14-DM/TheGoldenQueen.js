const GiganticCard = require('../../GiganticCard.js');

class TheGoldenQueen extends GiganticCard {
    // (Play only with the other half of The Golden Queen.)
    // Each player refills their hand to 1 additional card during their "draw cards" step.
    // After Fight/After Reap: Each player discards a random card from their hand. For each non-Ekwidon card discarded this way, gain 1A.
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.modifyHandSize(1)
        });

        const playerDiscard = (context) =>
            ability.actions.discardAtRandom({ target: context.player });
        const opponentDiscard = (context) =>
            ability.actions.discardAtRandom({ target: context.player.opponent });

        this.fight({
            reap: true,
            gameAction: ability.actions.chooseAction((context) => {
                if (!context.player.opponent) {
                    return { choices: { Me: [playerDiscard(context)] } };
                }
                if (!context.player.optionSettings.orderForcedAbilities) {
                    return {
                        choices: { Me: [playerDiscard(context), opponentDiscard(context)] }
                    };
                }
                return {
                    activePromptTitle: 'Choose which player discards first',
                    choices: {
                        Me: [playerDiscard(context), opponentDiscard(context)],
                        Opponent: [opponentDiscard(context), playerDiscard(context)]
                    }
                };
            }),
            then: () => ({
                alwaysTriggers: true,
                gameAction: ability.actions.gainAmber((context) => {
                    const cards = (context.preThenEvents || []).reduce(
                        (acc, e) => acc.concat(e.cards || []),
                        []
                    );
                    const nonEkwidon = cards.filter((c) => !c.hasHouse('ekwidon')).length;
                    return { amount: nonEkwidon };
                })
            })
        });
    }
}

TheGoldenQueen.id = 'the-golden-queen';

module.exports = TheGoldenQueen;
