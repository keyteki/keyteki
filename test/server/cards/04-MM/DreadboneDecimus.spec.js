describe('Dreadbone Decimus', function () {
    describe("Dreadbone Decimus's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['dreadbone-decimus'],
                    inPlay: ['snag']
                },
                player2: {
                    inPlay: ['troll', 'bad-penny']
                }
            });
        });

        describe('when the card is played', function () {
            beforeEach(function () {
                this.player1.play(this.dreadboneDecimus);
            });

            it('should prompt to be exalted', function () {
                expect(this.player1).toBeAbleToSelect(this.dreadboneDecimus);
            });

            describe('and is exalted', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.dreadboneDecimus);
                });

                it('should exalted the card', function () {
                    expect(this.dreadboneDecimus.tokens.amber).toBe(1);
                });

                it('should allow creatures with lower power to be selected', function () {
                    expect(this.player1).toBeAbleToSelect(this.badPenny);
                    expect(this.player1).not.toBeAbleToSelect(this.troll);
                });

                describe('and a creature is selected', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.badPenny);
                    });

                    it('should destroy the selected creature', function () {
                        expect(this.badPenny.location).not.toBe('play area');
                    });
                });
            });

            describe('and is cancelled', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('done');
                });

                it('should not allow any creatures to be selected', function () {
                    expect(this.player1).not.toBeAbleToSelect(this.badPenny);
                    expect(this.player1).not.toBeAbleToSelect(this.troll);
                });
            });
        });
    });
});
