const Card = require('../../Card.js');
const Effects = require('../../effects');

class Pupgrade extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.canPlayAsUpgrade()
        });

        this.whileAttached({
            effect: [
                ability.effects.modifyPower(3),
                ability.effects.gainAbility('destroyed', {
                    gameAction: [
                        ability.actions.cardLastingEffect({
                            duration: 'lastingEffect',
                            target: this,
                            effect: Effects.changeType('creature')
                        }),
                        ability.actions.putIntoPlay(() => ({
                            target: this,
                            deployIndex: this.controller.creaturesInPlay.length,
                            ready: true,
                            upgradeAllowed: true
                        }))
                    ],
                    effect: 'put {1} into play ready on the right flank',
                    effectArgs: [this]
                })
            ]
        });
    }
}

Pupgrade.id = 'pupgrade';

module.exports = Pupgrade;
