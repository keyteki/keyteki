const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class FadingApparition extends Card {
    // Entrench.
    // While Fading Apparition is exhausted, any amber you would gain by reaping may be taken from amber among friendly creatures instead of the common supply.
    setupCardAbilities() {
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register([{ 'onReap:preResolution': 'onReap' }]);
    }

    onReap(event) {
        if (!this.exhausted) {
            return;
        }
        if (event.card.controller !== this.controller) {
            return;
        }

        const promptCondition = () =>
            this.controller.creaturesInPlay.some((card) => card.amber > 0);
        if (!promptCondition()) {
            return;
        }

        this.game.promptForSelect(this.controller, {
            source: this,
            cardType: 'creature',
            controller: 'self',
            cardCondition: (card) => card.amber > 0,
            buttons: [{ text: 'Done', arg: 'done' }],
            onMenuCommand: () => true,
            onSelect: (player, card) => {
                if (!card || card.amber <= 0) {
                    return true;
                }
                this.game.addMessage(
                    '{0} uses {2} to take 1 amber from {1} instead of the common supply',
                    player,
                    card,
                    this
                );
                event.replaceHandler(() => {
                    card.removeToken('amber', 1);
                    player.modifyAmber(1);
                });
                return true;
            }
        });
    }
}

FadingApparition.id = 'fading-apparition';

module.exports = FadingApparition;
