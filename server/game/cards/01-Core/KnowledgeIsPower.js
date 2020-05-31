const Card = require('../../Card.js');

class KnowledgeIsPower extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'select',
                choices: {
                    'Archive a card': ability.actions.archive({
                        promptForSelect: {
                            location: 'hand',
                            controller: 'self'
                        }
                    }),
                    'Gain amber': ability.actions.gainAmber((context) => ({
                        amount: context.player.archives.length
                    }))
                }
            }
        });
    }
}

KnowledgeIsPower.id = 'knowledge-is-power';

module.exports = KnowledgeIsPower;
