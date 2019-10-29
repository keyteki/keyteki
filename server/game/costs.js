const Costs = {
    exhaust: () => ({
        canPay: context => !context.source.exhausted,
        payEvent: context => context.game.actions.exhaust().getEvent(context.source, context)
    }),
    use: () => ({
        canPay: context => {
            if(context.game.cardsUsed.concat(context.game.cardsPlayed).filter(card => card.name === context.source.name).length >= 6) {
                return false;
            } else if(context.source.hasHouse(context.player.activeHouse) || context.ability.omni) {
                return true;
            } else if(context.ignoreHouse || context.player.getEffects('canUse').some(match => match(context))) {
                return true;
            }

            let houseEffects = (context.player.effects.filter(effect => effect.type === 'canUseHouse' && !context.game.effectsUsed.includes(effect))) &&
            (context.player.effects.filter(effect => effect.type === 'canPlayOrUseHouse' && !context.game.effectsUsed.includes(effect))) &&
            (context.player.effects.filter(effect => effect.type === 'canPlayOrUseNonHouse' && !context.game.effectsUsed.includes(effect)));

            return houseEffects.some(effect => context.source.hasHouse(effect.getValue(context.player)));
        },
        payEvent: context => context.game.getEvent('unnamedEvent', {}, () => {
            context.game.cardsUsed.push(context.source);
            if(context.ignoreHouse || context.player.getEffects('canUse').some(match => match(context))) {
                return true;
            } else if(context.source.hasHouse(context.player.activeHouse)) {
                return true;
            }

            let houseEffects = (context.player.effects.filter(effect => effect.type === 'canUseHouse' && !context.game.effectsUsed.includes(effect))) &&
                (context.player.effects.filter(effect => effect.type === 'canPlayOrUseHouse' && !context.game.effectsUsed.includes(effect))) &&
                (context.player.effects.filter(effect => effect.type === 'canPlayOrUseNonHouse' && !context.game.effectsUsed.includes(effect)));
            let effect = houseEffects.find(effect => context.source.hasHouse(effect.getValue(context.player)));
            if(effect) {
                context.game.effectsUsed.push(effect);
                return true;
            }

            return false;
        })
    }),
    play: () => ({
        canPay: context => {
            if(context.game.cardsUsed.concat(context.game.cardsPlayed).filter(card => card.name === context.source.name).length >= 6) {
                return false;
            } else if(context.source.hasHouse(context.player.activeHouse) && !context.player.anyEffect('noActiveHouseForPlay')) {
                return true;
            } else if(context.ignoreHouse || context.player.getEffects('canPlay').some(match => match(context.source))) {
                return true;
            }

            let houseEffects = context.player.effects.filter(effect => effect.type === 'canPlayHouse' && !context.game.effectsUsed.includes(effect));
            let playOrUseEffects = context.player.effects.filter(effect => effect.type === 'canPlayOrUseHouse' && !context.game.effectsUsed.includes(effect));
            let nonHouseEffects = (context.player.effects.filter(effect => effect.type === 'canPlayNonHouse' && !context.game.effectsUsed.includes(effect)));
            let nonHousePlayOrUseEffects = (context.player.effects.filter(effect => effect.type === 'canPlayOrUseNonHouse' && !context.game.effectsUsed.includes(effect)));

            return houseEffects.some(effect => context.source.hasHouse(effect.getValue(context.player))) ||
                   playOrUseEffects.some(effect => context.source.hasHouse(effect.getValue(context.player))) ||
                   nonHouseEffects.some(effect => !context.source.hasHouse(effect.getValue(context.player)));
        },
        payEvent: context => context.game.getEvent('unnamedEvent', {}, () => {
            context.game.cardsPlayed.push(context.source);
            if(context.ignoreHouse || context.player.getEffects('canPlay').some(match => match(context.source))) {
                return true;
            } else if(context.source.hasHouse(context.player.activeHouse)) {
                return true;
            }

            let houseEffects = context.player.effects.filter(effect => effect.type === 'canPlayHouse' && !context.game.effectsUsed.includes(effect));
            let playOrUseEffects = context.player.effects.filter(effect => effect.type === 'canPlayOrUseHouse' && !context.game.effectsUsed.includes(effect));
            let nonHouseEffects = (context.player.effects.filter(effect => effect.type === 'canPlayNonHouse' && !context.game.effectsUsed.includes(effect)));
            let nonHousePlayOrUseEffects = (context.player.effects.filter(effect => effect.type === 'canPlayOrUseNonHouse' && !context.game.effectsUsed.includes(effect)));
            let effect = (
                houseEffects.find(effect => context.source.hasHouse(effect.getValue(context.player))) ||
                playOrUseEffects.find(effect => context.source.hasHouse(effect.getValue(context.player))) ||
                nonHousePlayOrUseEffects.find(effect => !context.source.hasHouse(effect.getValue(context.player))) ||
                nonHouseEffects.find(effect => {
                    let value = effect.getValue(context.player);
                    if(value.condition && !value.condition(context.source)) {
                        return false;
                    } else if(value.house) {
                        value = value.house;
                    }

                    return !context.source.hasHouse(value);
                })
            );
            if(effect) {
                context.game.effectsUsed.push(effect);
                return true;
            }

            return false;
        })
    }),
    payAmber: (amount = 1) => ({
        canPay: context => context.player.amber >= amount,
        payEvent: context => {
            let action = context.game.actions.steal({ amount: amount });
            action.name = 'pay';
            return action.getEvent(context.player, context);
        }
    }),
    loseAmber: (amount = 1) => ({
        canPay: context => context.player.amber >= amount,
        payEvent: context => context.game.actions.loseAmber({ amount: amount }).getEvent(context.player, context)
    })
};

module.exports = Costs;
