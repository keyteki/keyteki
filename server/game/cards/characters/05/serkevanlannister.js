const DrawCard = require('../../../drawcard.js');

class SerKevanLannister extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal'
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select location or attachment',
                    source: this,
                    cardCondition: card => (
                        card.location === 'discard pile' &&
                        card.controller === this.controller &&
                        (card.isFaction('lannister') || card.isFaction('neutral')) &&
                        (card.getType() === 'location' || card.getType() === 'attachment')),
                    onSelect: (player, card) => {
                        player.putIntoPlay(card);
                        this.game.addMessage('{0} uses {1} to put {2} into play', this.controller, this, card);

                        return true;
                    }
                });
            }
        });
    }
}

SerKevanLannister.code = '05003';

module.exports = SerKevanLannister;
