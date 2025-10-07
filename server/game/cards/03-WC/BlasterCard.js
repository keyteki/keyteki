import Card from '../../Card.js';

class BlasterCard extends Card {
    getAttachedAbility(ability, creatureName) {
        let choices = {
            'Deal 2 damage': () => true
        };

        const moveChoice = `Move ${this.name}`;
        choices[moveChoice] = () => true;

        let result = {
            optional: true,
            targets: {
                action: {
                    mode: 'select',
                    choices: choices
                },
                'Deal 2 damage': {
                    dependsOn: 'action',
                    cardType: 'creature',
                    gameAction: ability.actions.dealDamage({ amount: 2 })
                }
            }
        };

        result.targets[moveChoice] = {
            dependsOn: 'action',
            cardType: 'creature',
            cardCondition: (card) =>
                this.parent.name != creatureName &&
                card.name === creatureName &&
                !card.upgrades.includes(this),
            gameAction: ability.actions.attach({ upgrade: this })
        };

        return result;
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

export default BlasterCard;
