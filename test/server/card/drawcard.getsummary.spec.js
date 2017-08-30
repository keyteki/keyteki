const DrawCard = require('../../../server/game/drawcard.js');

xdescribe('DrawCard', function () {
    beforeEach(function () {
        this.testCard = { code: '111', label: 'test 1(some pack)', name: 'test 1' };
        this.card = new DrawCard({}, this.testCard);
    });

    describe('getSummary', function() {
        describe('military skill property', function() {
            describe('when the card has non-zero military skill', function() {
                beforeEach(function() {
                    this.testCard.militaryskill = 3;
                    this.summary = this.card.getSummary(true, true);
                });

                it('should include the military skill', function() {
                    expect(this.summary.militaryskill).toBe(3);
                });
            });

            describe('when the card has a zero military skill', function() {
                beforeEach(function() {
                    this.testCard.militaryskill = 0;
                    this.summary = this.card.getSummary(true, true);
                });

                it('should include the military skill', function() {
                    expect(this.summary.militaryskill).toBe(0);
                });
            });

            describe('when the card has no military skill', function() {
                beforeEach(function() {
                    this.testCard.militaryskill = null;
                    this.summary = this.card.getSummary(true, true);
                });

                it('should not include the military skill', function() {
                    expect(this.summary.militaryskill).toBe(null);
                });
            });
        });
        describe('political skill property', function() {
            describe('when the card has non-zero political skill', function() {
                beforeEach(function() {
                    this.testCard.politicalskill = 3;
                    this.summary = this.card.getSummary(true, true);
                });

                it('should include the political skill', function() {
                    expect(this.summary.politicalskill).toBe(3);
                });
            });

            describe('when the card has a zero political skill', function() {
                beforeEach(function() {
                    this.testCard.politicalskill = 0;
                    this.summary = this.card.getSummary(true, true);
                });

                it('should include the political skill', function() {
                    expect(this.summary.politicalskill).toBe(0);
                });
            });
            
            describe('when the card has no political skill', function() {
                beforeEach(function() {
                    this.testCard.politicalskill = null;
                    this.summary = this.card.getSummary(true, true);
                });

                it('should not include the political skill', function() {
                    expect(this.summary.politicalskill).toBe(null);
                });
            });
        });
    });
});
