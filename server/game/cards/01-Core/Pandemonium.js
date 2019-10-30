const Card = require('../../Card.js');

class Pandemonium extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'cause each undamaged creature to capture 1 amber from their opponent',
            gameAction: [
                ability.actions.capture(context => {
                    let undamagedCreatures = context.player.creaturesInPlay.filter(card => !card.hasToken('damage'));
                    if(!context.player.opponent || context.player.opponent.amber === 0) {
                        return { target: [] };
                    } else if(context.player.opponent.amber >= undamagedCreatures.length) {
                        return { controllerOpponent: true, target: undamagedCreatures };
                    }

                    return {
                        controllerOpponent: true,
                        promptForSelect: {
                            cardCondition: card => undamagedCreatures.includes(card),
                            mode: 'exactly',
                            numCards: context.player.opponent.amber
                        }
                    };
                }),
                ability.actions.capture(context => {
                    if(!context.player.opponent || context.player.amber === 0) {
                        return { target: [] };
                    }

                    let undamagedCreatures = context.player.opponent.creaturesInPlay.filter(card => !card.hasToken('damage'));
                    if(context.player.amber >= undamagedCreatures.length) {
                        return { controllerOpponent: true, target: undamagedCreatures };
                    }

                    return {
                        controllerOpponent: true,
                        promptForSelect: {
                            cardCondition: card => undamagedCreatures.includes(card),
                            mode: 'exactly',
                            numCards: context.player.amber
                        }
                    };
                })
            ]
        });
    }
}

Pandemonium.id = 'pandemonium';

module.exports = Pandemonium;
