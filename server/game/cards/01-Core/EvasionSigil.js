const Card = require('../../Card.js');

class EvasionSigil extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onResolveAbility: event => event.context.ability.title === 'Fight with this creature'
            },
            effect: 'discard the top card of {1}\'s deck: {2}. {3}{4}',
            effectArgs: context => {
                let player = context.event.context.player;
                let topCard = player.deck.length ? player.deck[0] : '';
                let cancelFight = topCard && topCard.hasHouse(context.game.activePlayer.activeHouse);
                return [player, topCard, cancelFight ? context.event.context.source : '', cancelFight ? ' is exhausted without effect' : ''];
            },
            gameAction: [
                ability.actions.exhaust(context => {
                    let player = context.event.context.player;
                    let topCard = player.deck.length ? player.deck[0] : '';
                    let cancelFight = topCard && topCard.hasHouse(context.game.activePlayer.activeHouse);
                    if(cancelFight) {
                        return { target: context.event.context.source };
                    }

                    return { target: [] };
                }),
                ability.actions.changeEvent(context => {
                    let player = context.event.context.player;
                    let topCard = player.deck.length ? player.deck[0] : '';
                    let cancelFight = topCard && topCard.hasHouse(context.game.activePlayer.activeHouse);
                    return {
                        event: context.event,
                        cancel: cancelFight
                    };
                }),
                ability.actions.discard(context => ({ target: context.event.context.player.deck[0] }))
            ]
        });
    }
}

EvasionSigil.id = 'evasion-sigil';

module.exports = EvasionSigil;
