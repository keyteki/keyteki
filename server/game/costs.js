const HouseUseEffects = ['canUseHouse', 'canPlayOrUseHouse'];
const NonHouseUseEffects = ['canPlayOrUseNonHouse'];
const HousePlayEffects = ['canPlayHouse', 'canPlayOrUseHouse'];
const NonHousePlayEffects = ['canPlayNonHouse', 'canPlayOrUseNonHouse'];

const Costs = {
    exhaust: () => ({
        canPay: (context) => !context.source.exhausted,
        payEvent: (context) => context.game.actions.exhaust().getEvent(context.source, context)
    }),
    use: () => ({
        canPay: (context) => {
            if (
                context.game.cardsUsed
                    .concat(context.game.cardsPlayed)
                    .filter((card) => card.name === context.source.name).length >= 6
            ) {
                return false;
            } else if (
                context.source.hasHouse(context.player.activeHouse) ||
                context.ability.omni
            ) {
                return true;
            } else if (
                context.ignoreHouse ||
                context.player.getEffects('canUse').some((effect) => effect.match(context))
            ) {
                return true;
            }

            return context.player.effects.some(
                (effect) =>
                    ((HouseUseEffects.includes(effect.type) &&
                        context.source.hasHouse(effect.getValue(context.player))) ||
                        (NonHouseUseEffects.includes(effect.type) &&
                            !context.source.hasHouse(effect.getValue(context.player)))) &&
                    !context.game.effectsUsed.includes(effect)
            );
        },
        payEvent: (context) =>
            context.game.getEvent('unnamedEvent', {}, () => {
                context.game.cardUsed(context.source);
                if (
                    context.ignoreHouse ||
                    context.player.getEffects('canUse').some((effect) => effect.match(context))
                ) {
                    return true;
                } else if (context.source.hasHouse(context.player.activeHouse)) {
                    return true;
                }

                let houseEffects = context.player.effects.filter(
                    (effect) =>
                        (HouseUseEffects.includes(effect.type) ||
                            NonHouseUseEffects.includes(effect.type)) &&
                        !context.game.effectsUsed.includes(effect)
                );
                let effect = houseEffects.find(
                    (effect) =>
                        (HouseUseEffects.includes(effect.type) &&
                            context.source.hasHouse(effect.getValue(context.player))) ||
                        (NonHouseUseEffects.includes(effect.type) &&
                            !context.source.hasHouse(effect.getValue(context.player)))
                );

                if (effect) {
                    context.game.effectUsed(effect);
                    return true;
                }

                return false;
            })
    }),
    play: () => ({
        canPay: (context) => {
            if (
                context.source.getKeywordValue('alpha') > 0 &&
                !context.game.firstThingThisPhase()
            ) {
                return false;
            } else if (
                context.game.cardsUsed
                    .concat(context.game.cardsPlayed)
                    .filter((card) => card.name === context.source.name).length >= 6
            ) {
                return false;
            } else if (context.ignoreHouse) {
                return true;
            }

            let effects = context.player.effects.filter(
                (effect) =>
                    (HousePlayEffects.includes(effect.type) ||
                        NonHousePlayEffects.includes(effect.type)) &&
                    !context.game.effectsUsed.includes(effect)
            );

            if (
                effects.some((effect) => {
                    let value = effect.getValue(context.player);
                    if (value.condition && !value.condition(context.source)) {
                        return false;
                    } else if (value.house) {
                        value = value.house;
                    }

                    return (
                        (HousePlayEffects.includes(effect.type) &&
                            context.source.hasHouse(value)) ||
                        (NonHousePlayEffects.includes(effect.type) &&
                            !context.source.hasHouse(value))
                    );
                })
            ) {
                return true;
            } else if (
                context.player
                    .getEffects('canPlay')
                    .some((match) => match(context.source, context)) ||
                (context.source.hasHouse(context.player.activeHouse) &&
                    !context.player.anyEffect('noActiveHouseForPlay'))
            ) {
                return true;
            }

            return false;
        },
        payEvent: (context) =>
            context.game.getEvent('unnamedEvent', {}, () => {
                if (context.ignoreHouse) {
                    return true;
                }

                let effects = context.player.effects.filter(
                    (effect) =>
                        (HousePlayEffects.includes(effect.type) ||
                            NonHousePlayEffects.includes(effect.type)) &&
                        !context.game.effectsUsed.includes(effect)
                );

                let matchedEffects = effects.filter((effect) => {
                    let value = effect.getValue(context.player);
                    if (value.condition && !value.condition(context.source)) {
                        return false;
                    } else if (value.house) {
                        value = value.house;
                    }

                    return (
                        (HousePlayEffects.includes(effect.type) &&
                            context.source.hasHouse(value)) ||
                        (NonHousePlayEffects.includes(effect.type) &&
                            !context.source.hasHouse(value))
                    );
                });

                if (
                    matchedEffects.length === 1 ||
                    (matchedEffects.length > 0 &&
                        matchedEffects.every(
                            (effect) =>
                                effect.context.source.id === matchedEffects[0].context.source.id
                        ))
                ) {
                    context.game.effectUsed(matchedEffects[0]);
                    return true;
                } else if (matchedEffects.length > 1) {
                    const choices = matchedEffects.map(
                        (effect) => effect.context.source.cardData.name
                    );
                    const handlers = matchedEffects.map((effect) => () => {
                        context.game.effectUsed(effect);
                    });
                    context.game.promptWithHandlerMenu(context.player, {
                        activePromptTitle: 'Choose an ability:',
                        source: context.source,
                        choices,
                        handlers
                    });
                    return true;
                } else if (
                    context.player
                        .getEffects('canPlay')
                        .some((match) => match(context.source, context)) ||
                    context.source.hasHouse(context.player.activeHouse)
                ) {
                    return true;
                }

                return false;
            })
    }),
    payAmber: (amount = 1) => ({
        canPay: (context, aggregatedCost) => {
            aggregatedCost.amber = amount + (aggregatedCost.amber || 0);
            return context.player.amber >= aggregatedCost.amber;
        },
        payEvent: (context) => {
            context.game.addMessage('{0} pays {1} to their opponent', context.player, amount);

            let action = context.game.actions.transferAmber({ amount: amount });
            action.name = 'pay';
            return action.getEvent(context.player, context);
        }
    }),
    loseAmber: (amount = 1) => ({
        canPay: (context, aggregatedCost) => {
            aggregatedCost.amber = amount + (aggregatedCost.amber || 0);
            return context.player.amber >= aggregatedCost.amber;
        },
        payEvent: (context) =>
            context.game.actions.loseAmber({ amount: amount }).getEvent(context.player, context)
    })
};

module.exports = Costs;
