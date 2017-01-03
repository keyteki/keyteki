const _ = require('underscore');

const AgendaCard = require('../../agendacard.js');

class TheRainsOfCastamere extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDecksPrepared', 'onPlotFlip', 'afterChallenge']);
    }

    onDecksPrepared() {
        var schemePartition = this.owner.plotDeck.partition(card => card.hasTrait('Scheme'));
        this.schemes = schemePartition[0];
        this.owner.plotDeck = _(schemePartition[1]);
    }

    onPlotFlip() {
        this.removeExistingSchemeFromGame();
    }

    removeExistingSchemeFromGame() {
        var previousPlot = this.owner.activePlot;

        if(!previousPlot || !previousPlot.hasTrait('Scheme')) {
            return;
        }

        this.owner.removeActivePlot();
        previousPlot.moveTo('out of game');
    }

    afterChallenge(event, challenge) {
        if(challenge.challengeType !== 'intrigue' || challenge.winner !== this.owner || challenge.strengthDifference < 5) {
            return;
        }

        if(this.owner.faction.kneeled) {
            return;
        }

        this.game.promptWithMenu(this.owner, this, {
            activePrompt: {
                menuTitle: 'Trigger Scheme plot?',
                buttons: this.menuButtons()
            },
            waitingPromptTitle: 'Waiting for opponent to use' + this.name
        });
    }

    menuButtons() {
        var buttons = _.map(this.schemes, scheme => {
            return { text: scheme.name, method: 'revealScheme', arg: scheme.uuid, card: scheme.getSummary(true) };
        });

        buttons.push({ text: 'Done', method: 'cancelScheme' });
        return buttons;
    }

    revealScheme(player, schemeId) {
        var scheme = _.find(this.schemes, card => card.uuid === schemeId);

        if(!scheme) {
            return false;
        }

        this.game.addMessage('{0} uses {1} to reveal {2}', player, this, scheme);

        this.removeExistingSchemeFromGame();

        this.schemes = _.reject(this.schemes, card => card === scheme);

        player.selectedPlot = scheme;
        player.flipPlotFaceup();
        player.revealPlot();
        this.game.raiseEvent('onPlotRevealed', player);

        player.kneelCard(player.faction);

        return true;
    }

    cancelScheme() {
        return true;
    }
}

TheRainsOfCastamere.code = '05045';

module.exports = TheRainsOfCastamere;
