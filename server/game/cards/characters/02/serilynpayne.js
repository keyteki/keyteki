const DrawCard = require('../../../drawcard.js');

class SerIlynPayne extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel Ser Ilyn Payne to kill a character',
            cost: ability.costs.kneelSelf(),
            method: 'kneel'
        });
    }

    kneel(player) {
        if(this.controller !== player || this.location !== 'play area' || player.phase !== 'marshal') {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            source: this,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.getCost() <= 3,
            gameAction: 'kill',
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;
    }

    onCardSelected(player, card) {
        this.game.addMessage('{0} kneels {1} to kill {2}', player, this, card);

        card.controller.killCharacter(card);

        return true;
    }
}

SerIlynPayne.code = '02109';

module.exports = SerIlynPayne;
