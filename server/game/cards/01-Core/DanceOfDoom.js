const Card = require('../../Card.js');

class DanceOfDoom extends Card {
    setupCardAbilities(ability) {
        let choices = {};
        for(let i = 1; i < 13; i++) {
            choices[i.toString()] = ability.actions.destroy(context => ({
                target: context.game.creaturesInPlay.filter(card => card.power === i)
            }));
        }
        this.play({
            target: {
                mode: 'select',
                choices: choices
            },
            effect: 'destroy all creatures with power {1}',
            effectArgs: context => context.select
        });
    }
}

DanceOfDoom.id = 'dance-of-doom'; // This is a guess at what the id might be - please check it!!!

module.exports = DanceOfDoom;
