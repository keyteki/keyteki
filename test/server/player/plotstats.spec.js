/* global describe, it, beforeEach, expect, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const Player = require('../../../server/game/player.js');
const DrawCard = require('../../../server/game/drawcard.js');

class TestCard extends DrawCard {
    getIncome() {
        return 1;
    }
}

function income(card) {
    return card.getIncome();
}

describe('the Player', function() {
    beforeEach(function() {
        this.player = new Player('1', 'Player 1', true);
        this.plotSpy = jasmine.createSpyObj('plot', ['getIncome']);
        this.incomeCard = new TestCard(this.player, { });
        this.card = new DrawCard(this.player, { });
        this.attachmentSpy = jasmine.createSpyObj('attachment', ['getIncome']);

        this.player.initialise();
        this.player.activePlot = this.plotSpy;

        this.plotSpy.getIncome.and.returnValue(5);

        this.player.cardsInPlay.push(this.card);
    });

    describe('the getTotalPlotStat() function', function() {
        describe('when property is only provided by plot', function() {
            it('should equal the plot value', function() {
                expect(this.player.getTotalPlotStat(income)).toBe(5);
            });
        });

        describe('when a property modifying card is in play', function() {
            beforeEach(function() {
                this.player.cardsInPlay.push(this.incomeCard);
            });

            it('should include both the plot value and the modifier', function() {
                expect(this.player.getTotalPlotStat(income)).toBe(6);
            });
        });

        describe('when a property modifying attachment is in play', function() {
            beforeEach(function() {
                this.card.attachments = [this.attachmentSpy];
                this.attachmentSpy.getIncome.and.returnValue(1);
            });

            it('should include both the plot value and the modifier', function() {
                expect(this.player.getTotalPlotStat(income)).toBe(6);
            });
        });
    });
});
