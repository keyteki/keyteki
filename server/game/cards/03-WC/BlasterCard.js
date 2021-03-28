const Card = require('../../Card.js');

class BlasterCard extends Card {
    getAttachedAbility(ability, creatureName) {
        let choices = {
            'Deal 2 damage': () => true
        };

        choices[`Move ${this.name}`] = () => true;

        return {
            optional: true,
            targets: {
                action: {
                    mode: 'select',
                    choices: choices
                },
                creature: {
                    dependsOn: 'action',
                    cardType: 'creature',
                    cardCondition: (card, context) =>
                        context.selects.action.choice === 'Deal 2 damage'
                            ? true
                            : card.name === creatureName && !card.upgrades.includes(this),
                    gameAction: [
                        ability.actions.dealDamage((context) => ({
                            amount: 2,
                            target:
                                context.selects.action.choice === 'Deal 2 damage'
                                    ? context.targets.creature
                                    : []
                        })),
                        ability.actions.attach((context) => ({
                            upgrade: this,
                            target:
                                context.selects.action.choice === `Move ${this.name}`
                                    ? context.targets.creature
                                    : []
                        }))
                    ]
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
