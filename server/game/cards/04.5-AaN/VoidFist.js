const DrawCard = require('../../drawcard.js');
const EventRegistrar = require('../../eventregistrar.js');

class VoidFist extends DrawCard {
    setupCardAbilities(ability) {
        this.cardsPlayedThisConflict = {};
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onConflictFinished', 'onCardPlayed']);
        this.action({
            title: 'Bow and send a character home',
            condition: context => this.cardsPlayedThisConflict[context.player.uuid] >= 2,
            target: {
                cardType: 'character',
                cardCondition: (card, context) =>
                    card.isParticipating() && this.game.currentConflict.getCharacters(context.player).some(myCard =>
                        myCard.hasTrait('monk') && myCard.militarySkill > card.militarySkill
                    ),
                gameAction: [ability.actions.bow(), ability.actions.sendHome()]
            },
            effect: 'bow {0} and send them home'
        });
    }

    onConflictFinished() {
        this.cardsPlayedThisConflict = {};
    }

    onCardPlayed(event) {
        if(this.game.isDuringConflict()) {
            if(this.cardsPlayedThisConflict[event.player.uuid]) {
                this.cardsPlayedThisConflict[event.player.uuid] += 1;
            } else {
                this.cardsPlayedThisConflict[event.player.uuid] = 1;
            }
        }
    }
}

VoidFist.id = 'void-fist';

module.exports = VoidFist;
