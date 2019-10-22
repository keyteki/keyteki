const Card = require('../../Card.js');

class BlasterCard extends Card {
    getAttachedAbility(ability, blasterName, officerName) {
        let choices = {
            'Deal 2 damages': () => true
        };

        choices[`Move ${blasterName}`] = () => true;

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
                    cardCondition: (card, context) => (context.selects.action.choice === 'Deal 2 damages') ? true : card.name === officerName && !card.upgrades.includes(this),
                    gameAction: [
                        ability.actions.dealDamage(context => ({
                            amount: 2,
                            target: context.selects.action.choice === 'Deal 2 damages' ? context.targets.creature : []
                        })),
                        ability.actions.attach(context => ({
                            upgrade: this,
                            target: context.selects.action.choice === 'Move ' + blasterName ? context.targets.creature : []
                        }))
                    ]
                }
            }
        };
    }

    setupBlasterCardAbilities(ability, blasterName, officerName) {
        this.whileAttached({
            effect: [
                ability.effects.gainAbility('reap', this.getAttachedAbility(ability, blasterName, officerName)),
                ability.effects.gainAbility('fight', this.getAttachedAbility(ability, blasterName, officerName))
            ]
        });
    }
}

module.exports = BlasterCard;
