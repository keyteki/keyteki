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
            } else if(context.ignoreHouse || context.player.getEffects('canUse').some(match => match(context.source))) {
                return true;
            }
            let houseEffects = context.player.effects.filter(effect => effect.type === 'canUseHouse' && !context.game.effectsUsed.includes(effect));
            return houseEffects.some(effect => context.source.hasHouse(effect.getValue(context.player)));
        },
        payEvent: context => context.game.getEvent('unnamedEvent', {}, () => {
            context.game.cardsUsed.push(context.source);
            if(context.ignoreHouse || context.player.getEffects('canUse').some(match => match(context.source))) {
                return true;
            } else if(context.source.hasHouse(context.player.activeHouse)) {
                return true;
            }
            let houseEffects = context.player.effects.filter(effect => effect.type === 'canUseHouse' && !context.game.effectsUsed.includes(effect));
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
            } else if(context.source.hasHouse(context.player.activeHouse)) {
                return true;
            } else if(context.ignoreHouse || context.player.getEffects('canPlay').some(match => match(context.source))) {
                return true;
            }
            let houseEffects = context.player.effects.filter(effect => effect.type === 'canPlayHouse' && !context.game.effectsUsed.includes(effect));
            let nonHouseEffects = context.player.effects.filter(effect => effect.type === 'canPlayNonHouse' && !context.game.effectsUsed.includes(effect));
            return houseEffects.some(effect => context.source.hasHouse(effect.getValue(context.player))) ||
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
            let nonHouseEffects = context.player.effects.filter(effect => effect.type === 'canPlayNonHouse' && !context.game.effectsUsed.includes(effect));
            let effect = (
                houseEffects.find(effect => context.source.hasHouse(effect.getValue(context.player))) ||
                nonHouseEffects.find(effect => !context.source.hasHouse(effect.getValue(context.player)))
            );
            if(effect) {
                context.game.effectsUsed.push(effect);
                return true;
            }
            return false;
        })
    }),
    payAmber: (amount = 1) => ({
        canPlay: context => context.player.amber >= amount,
        payEvent: context => context.game.actions.giveAmber({ amount: amount }).getEvent(context.player.opponent, context)
    }),
    loseAmber: (amount = 1) => ({
        canPlay: context => context.player.amber >= amount,
        payEvent: context => context.game.actions.loseAmber({ amount: amount }).getEvent(context.player, context)
    })
};

module.exports = Costs;
