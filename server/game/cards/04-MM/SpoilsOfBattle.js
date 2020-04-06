const Card = require('../../Card.js');

class SpoilsOfBattle extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'exactly',
                numCards: 1,
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture()
            },
            then: {
                alwaysTriggers: true,
                effect: 'cause each creature with aember to capture 1 aember from their opponent',
                gameAction: [
                    ability.actions.capture(context => {
                        let amberedCreatures = context.player.creaturesInPlay.filter(card => card.hasToken('amber'));
                        if(!context.player.opponent || context.player.opponent.amber === 0) {
                            return { target: [] };
                        } else if(context.player.opponent.amber >= amberedCreatures.length) {
                            return { target: amberedCreatures };
                        }

                        return {
                            promptForSelect: {
                                cardCondition: card => amberedCreatures.includes(card),
                                mode: 'exactly',
                                numCards: context.player.opponent.amber
                            }
                        };
                    }),
                    ability.actions.capture(context => {
                        if(!context.player.opponent || context.player.amber === 0) {
                            return { target: [] };
                        }

                        let amberedCreatures = context.player.opponent.creaturesInPlay.filter(card => card.hasToken('amber'));
                        if(context.player.amber >= amberedCreatures.length) {
                            return { target: amberedCreatures };
                        }

                        return {
                            promptForSelect: {
                                cardCondition: card => amberedCreatures.includes(card),
                                mode: 'exactly',
                                numCards: context.player.amber
                            }
                        };
                    })
                ]
            }
        });
    }
}

SpoilsOfBattle.id = 'spoils-of-battle';
module.exports = SpoilsOfBattle;
