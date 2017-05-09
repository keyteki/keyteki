const _ = require('underscore');

const AgendaCard = require('../../agendacard.js');
const RevealPlots = require('../../gamesteps/revealplots.js');

class TheRainsOfCastamere extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDecksPrepared', { 'onPlotFlip:forcedinterrupt': 'onPlotFlip' }]);
    }

    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    !this.owner.faction.kneeled &&
                    challenge.challengeType === 'intrigue' &&
                    challenge.winner === this.owner &&
                    challenge.strengthDifference >= 5
                )
            },
            handler: this.trigger.bind(this)
        });

        this.action({
            title: 'Manually trigger',
            method: 'trigger',
            cost: ability.costs.kneelFactionCard()
        });
    }

    trigger() {
        this.game.promptWithMenu(this.owner, this, {
            activePrompt: {
                menuTitle: 'Trigger Scheme plot?',
                buttons: this.menuButtons()
            },
            source: this
        });        
    }

    onDecksPrepared() {
        this.owner.createAdditionalPile('scheme plots', { title: 'Schemes', area: 'plots', isPrivate: true });
        var schemePartition = this.owner.plotDeck.partition(card => card.hasTrait('Scheme'));
        this.schemes = schemePartition[0];
        this.owner.plotDeck = _(schemePartition[1]);
        _.each(this.schemes, scheme => {
            this.owner.moveCard(scheme, 'scheme plots');
        });
    }

    onPlotFlip() {
        this.removeExistingSchemeFromGame();
    }

    removeExistingSchemeFromGame() {
        var previousPlot = this.owner.activePlot;

        if(!previousPlot || !previousPlot.hasTrait('Scheme')) {
            return;
        }

        this.owner.removeActivePlot('out of game');
    }

    menuButtons() {
        var buttons = _.map(this.schemes, scheme => {
            return { method: 'revealScheme', card: scheme };
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
        this.game.queueStep(new RevealPlots(this.game, [scheme]));

        player.kneelCard(player.faction);

        return true;
    }

    cancelScheme() {
        return true;
    }
}

TheRainsOfCastamere.code = '05045';

module.exports = TheRainsOfCastamere;
