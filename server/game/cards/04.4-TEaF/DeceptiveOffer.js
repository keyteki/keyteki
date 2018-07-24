const DrawCard = require('../../drawcard.js');

class DeceptiveOffer extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Increase a character\'s military and political skill or take an honor from your opponent',
            targets: {
                character: {
                    cardType: 'character',
                    controller: 'self',
                    cardCondition: card => card.isParticipating()
                },
                select: {
                    mode: 'select',
                    dependsOn: 'character',
                    player: 'opponent',
                    choices: {
                        'Allow your opponent\'s character to gain military and political skill': ability.actions.cardLastingEffect(context => ({
                            target: context.targets.character,
                            duration: 'untilEndOfConflict',
                            effect: ability.effects.modifyBothSkills(2)
                        })),
                        'Give your opponent 1 honor': ability.actions.takeHonor()
                    }
                }
            },
            effect: '{1}{2}',
            effectArgs: context => {
                if(context.selects.select.choice === 'Give your opponent 1 honor') {
                    return ['take 1 honor from ', context.player.opponent];
                }
                return ['give +2/+2 to ', context.targets.character];
            }
        });
    }
}

DeceptiveOffer.id = 'deceptive-offer';

module.exports = DeceptiveOffer;
