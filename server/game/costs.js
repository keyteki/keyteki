const ThenAbility = require('./ThenAbility');
const DestroyAction = require('./GameActions/DestroyAction');

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
            } else if (context.ignoreHouse || context.player.checkConditions('canUse', context)) {
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
                if (context.ignoreHouse || context.player.checkConditions('canUse', context)) {
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

                let playAllowanceEffects = context.player.effects.filter((effect) => {
                    if (
                        !(
                            HousePlayEffects.includes(effect.type) ||
                            NonHousePlayEffects.includes(effect.type)
                        )
                    ) {
                        return false;
                    }
                    if (context.game.effectsUsed.includes(effect)) {
                        return false;
                    }
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

                playAllowanceEffects = playAllowanceEffects.concat(
                    context.player.effects.filter(
                        (e) =>
                            e.type === 'canPlay' &&
                            e.getValue(context.player)(context.source, context)
                    )
                );

                const playAllowanceChoices = [];
                // Create non-duplicate play allowance effect handlers.
                playAllowanceEffects.forEach((effect) => {
                    if (
                        !playAllowanceChoices.find(
                            (choice) => choice.sourceId === effect.context.source.id
                        )
                    ) {
                        playAllowanceChoices.push({
                            sourceId: effect.context.source.id,
                            sourceName: effect.context.source.cardData.name,
                            handler: () => {
                                // All 'canPlay' effects refresh after use.
                                if (
                                    HousePlayEffects.includes(effect.type) ||
                                    NonHousePlayEffects.includes(effect.type)
                                ) {
                                    context.game.effectUsed(effect);
                                }
                            }
                        });
                    }
                });

                if (playAllowanceChoices.length === 1) {
                    playAllowanceChoices[0].handler();
                    return true;
                } else if (playAllowanceChoices.length > 1) {
                    context.game.promptWithHandlerMenu(context.player, {
                        activePromptTitle: 'Choose a play allowance ability:',
                        source: context.source,
                        choices: playAllowanceChoices.map(
                            (playAllowanceChoice) => playAllowanceChoice.sourceName
                        ),
                        handlers: playAllowanceChoices.map(
                            (playAllowanceChoice) => playAllowanceChoice.handler
                        )
                    });
                    return true;
                } else if (context.source.hasHouse(context.player.activeHouse)) {
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
    }),
    destroyFriendlyCreature: () => ({
        // If the destroy fails, the whole pipline should fail
        // (e.g. including exhausting the creature being used).
        canFail: true,
        canPay: (context) => context.game.activePlayer.creaturesInPlay.length > 0,
        payEvent: (context) => {
            let event = context.game.getEvent('unnamedEvent', {});

            let t = new ThenAbility(context.game, context.source, {
                target: {
                    controller: 'self',
                    type: 'creature',
                    gameAction: new DestroyAction({})
                },
                then: {
                    alwaysTriggers: true,
                    condition: (context) => {
                        // This is just a hacky way of propagating the
                        // cancellation back to the cost event itself.
                        event.cancelled = context.preThenEvent.cancelled;
                        return false;
                    }
                }
            });

            event.handler = () => {
                context.game.queueSimpleStep(() => t.resolveTargets(context));
                context.game.queueSimpleStep(() => t.executeHandler(context));
            };
            return event;
        }
    })
};

module.exports = Costs;
