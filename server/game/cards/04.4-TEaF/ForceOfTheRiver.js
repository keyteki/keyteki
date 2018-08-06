const DrawCard = require('../../drawcard.js');

class ForceOfTheRiver extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Create spirits from facedown dynasty cards',
            condition: () => this.game.isDuringConflict(),
            effect: 'summon Spirits of the River!',
            gameAction: ability.actions.createToken(context => ({
                target: ['province 1', 'province 2', 'province 3', 'province 4'].map(
                    location => context.player.getDynastyCardInProvince(location)
                ).filter(card => card.facedown)
            }))
        });
    }

    canAttach(card, context) {
        if(!card.hasTrait('shugenja') || card.controller !== context.player) {
            return false;
        }
        return super.canAttach(card, context);
    }
}

ForceOfTheRiver.id = 'force-of-the-river';

module.exports = ForceOfTheRiver;
