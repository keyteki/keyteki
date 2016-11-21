/* global describe, it, beforeEach, expect, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const Player = require('../../../server/game/player.js');

function income(card) {
    return card.getIncome();
}

describe('the Player', () => {
    beforeEach(() => {
        this.player = new Player('1', 'Player 1', true);
        this.plotSpy = jasmine.createSpyObj('plot', ['getIncome']);
        this.incomeCardSpy = jasmine.createSpyObj('card', ['getIncome']);
        this.cardSpy = jasmine.createSpyObj('card', ['getIncome']);

        this.player.initialise();
        this.player.activePlot = this.plotSpy;

        this.plotSpy.getIncome.and.returnValue(5);
        
        this.player.cardsInPlay.push(this.cardSpy);
    });

    describe('the getTotalPlotStat() function', () => {
        describe('when property is only provided by plot', () => {
            it('should equal the plot value', () => {
                expect(this.player.getTotalPlotStat(income)).toBe(5);
            });
        });

        describe('when a property modifying card is in play', () => {
            beforeEach(() => {
                this.incomeCardSpy.getIncome.and.returnValue(1);
                this.player.cardsInPlay.push(this.incomeCardSpy);
            });

            it('should include both the plot value and the modifier', () => {
                expect(this.player.getTotalPlotStat(income)).toBe(6);
            });
        });

        xdescribe('when a property modifying attachment is in play', () => {
            beforeEach(() => {
                this.player.cardsInPlay.push({ card: {}, attachments: [{ income: 1 }] });
            });

            it('should include both the plot value and the modifier', () => {
                expect(this.player.getTotalPlotStat(income)).toBe(6);
            });
        });
    });
});
