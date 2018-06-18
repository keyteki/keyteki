const DrawCard = require('../../drawcard.js');

class AkodoGunso extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Refill province faceup',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source &&
                                                      ['province 1', 'province 2', 'province 3', 'province 4'].includes(event.originalLocation)
            },
            gameAction: ability.actions.flipDynasty(context => ({
                target: context.player.getDynastyCardInProvince(context.event.originalLocation)
            }))
        });
    }
}

AkodoGunso.id = 'akodo-gunso';

module.exports = AkodoGunso;
