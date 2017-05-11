const DrawCard = require('../../../drawcard.js');

class ShaggaSonOfDolf extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ambush(0)',
            location: 'hand',
            phase: 'challenge',
            condition: () => this.hasClansmanOrTyrion(),
            handler: () => {
                this.controller.putIntoPlay(this, 'ambush');
                this.wasAmbush = true;
                this.game.addMessage('{0} ambushes {1} into play for free', this.controller, this);
            }
        });

        this.forcedReaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'ambush'
            },
            target: {
                activePromptTitle: 'Select a character to kill',
                cardCondition: card =>
                    card.location === 'play area'
                    && card.controller === this.controller
                    && card.isFaction('lannister')
                    && card.getType() === 'character',
                gameAction: 'kill'
            },
            handler: context => {
                this.game.addMessage('{0} is forced by {1} to kill a character', this.controller, this);
                context.target.controller.killCharacter(context.target);
            }
        });
    }

    hasClansmanOrTyrion() {
        var cards = this.controller.filterCardsInPlay(card => {
            return (card.hasTrait('Clansman') && card.getType() === 'character') || card.name === 'Tyrion Lannister';
        });

        return cards.length > 0;
    }
}

ShaggaSonOfDolf.code = '05009';

module.exports = ShaggaSonOfDolf;
