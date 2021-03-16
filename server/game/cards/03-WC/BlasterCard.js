const Card = require('../../Card.js');

class BlasterCard extends Card {
    getAttachedAbility(ability, creatureName) {
        let choices = {
            'Deal 2 damage': () => true
        };

        const moveChoice = `Move ${this.name}`;
        choices[moveChoice] = () => true;

        return {
            optional: true,
            targets: {
                action: {
                    mode: 'select',
                    choices: choices
                },
                dealDamage: {
                    dependsOn: 'action',
                    targetCondition: (context) => context.selects.action.choice === 'Deal 2 damage',
                    cardType: 'creature',
                    gameAction: ability.actions.dealDamage({ amount: 2 })
                },
                moveBlaster: {
                    dependsOn: 'action',
                    targetCondition: (context) => context.selects.action.choice === moveChoice,
                    cardType: 'creature',
                    cardCondition: (card) =>
                        card.name === creatureName && !card.upgrades.includes(this),
                    gameAction: ability.actions.attach({ upgrade: this })
                }
            }
        };
    }

    setupBlasterCardAbilities(ability, creatureName) {
        this.whileAttached({
            effect: [
                ability.effects.gainAbility('reap', this.getAttachedAbility(ability, creatureName)),
                ability.effects.gainAbility('fight', this.getAttachedAbility(ability, creatureName))
            ]
        });
    }
}

module.exports = BlasterCard;
