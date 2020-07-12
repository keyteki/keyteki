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
                context.player.getEffects('canUse').some((match) => match(context))
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
                context.game.cardsUsed.push(context.source);
                if (
                    context.ignoreHouse ||
                    context.player.getEffects('canUse').some((match) => match(context))
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
                    context.game.effectsUsed.push(effect);
                    return true;
                }

                return false;
            })
    }),
    play: () => ({
        canPay: (context) => {
            if (context.source.getKeywordValue('alpha') > 0 && !context.game.firstThingThisTurn()) {
                return false;
            } else if (
                context.game.cardsUsed
                    .concat(context.game.cardsPlayed)
                    .filter((card) => card.name === context.source.name).length >= 6
            ) {
                return false;
            } else if (
                context.source.hasHouse(context.player.activeHouse) &&
                !context.player.anyEffect('noActiveHouseForPlay')
            ) {
                return true;
            } else if (
                context.ignoreHouse ||
                context.player.getEffects('canPlay').some((match) => match(context.source, context))
            ) {
                return true;
            }

            let effects = context.player.effects.filter(
                (effect) =>
                    (HousePlayEffects.includes(effect.type) ||
                        NonHousePlayEffects.includes(effect.type)) &&
                    !context.game.effectsUsed.includes(effect)
            );

            return effects.some((effect) => {
                let value = effect.getValue(context.player);
                if (value.condition && !value.condition(context.source)) {
                    return false;
                } else if (value.house) {
                    value = value.house;
                }

                return (
                    (HousePlayEffects.includes(effect.type) && context.source.hasHouse(value)) ||
                    (NonHousePlayEffects.includes(effect.type) && !context.source.hasHouse(value))
                );
            });
        },
        payEvent: (context) =>
            context.game.getEvent('unnamedEvent', {}, () => {
                if (
                    context.ignoreHouse ||
                    context.player
                        .getEffects('canPlay')
                        .some((match) => match(context.source, context))
                ) {
                    return true;
                } else if (context.source.hasHouse(context.player.activeHouse)) {
                    return true;
                }

                let effects = context.player.effects.filter(
                    (effect) =>
                        (HousePlayEffects.includes(effect.type) ||
                            NonHousePlayEffects.includes(effect.type)) &&
                        !context.game.effectsUsed.includes(effect)
                );

                let effect = effects.find((effect) => {
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

                if (effect) {
                    context.game.effectsUsed.push(effect);
                    return true;
                }

                return false;
            })
    }),
    payAmber: (amount = 1) => ({
        canPay: (context) => context.player.amber >= amount,
        payEvent: (context) => {
            let action = context.game.actions.transferAmber({ amount: amount });
            action.name = 'pay';
            return action.getEvent(context.player, context);
        }
    }),
    loseAmber: (amount = 1) => ({
        canPay: (context) => context.player.amber >= amount,
        payEvent: (context) =>
            context.game.actions.loseAmber({ amount: amount }).getEvent(context.player, context)
    })
};

module.exports = Costs;
