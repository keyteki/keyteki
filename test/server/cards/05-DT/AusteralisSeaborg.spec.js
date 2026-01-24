describe('Austeralis Seaborg', function () {
    describe("Austeralis Seaborg's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    inPlay: ['austeralis-seaborg', 'snufflegator', 'bumblebird'],
                    hand: ['easy-marks']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens', 'faygin', 'shooler']
                }
            });

            this.bumblebird.ward();
        });

        describe('when reap', function () {
            beforeEach(function () {
                this.player1.reap(this.austeralisSeaborg);
            });

            it('should prompt to select a creature', function () {
                expect(this.player1).toBeAbleToSelect(this.austeralisSeaborg);
                expect(this.player1).toBeAbleToSelect(this.bumblebird);
                expect(this.player1).toBeAbleToSelect(this.snufflegator);
                expect(this.player1).toBeAbleToSelect(this.murkens);
                expect(this.player1).toBeAbleToSelect(this.faygin);
                expect(this.player1).toBeAbleToSelect(this.shooler);
            });

            describe('and a creature is selected and not destroyed', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.shooler);
                });

                it('should deal 2D to it', function () {
                    expect(this.shooler.damage).toBe(2);
                });

                it('should not raise the tide', function () {
                    expect(this.player1.isTideHigh()).toBe(false);
                });
            });

            describe('and a creature is selected and not destroyed due to ward', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.bumblebird);
                });

                it('should deal 2D to it', function () {
                    expect(this.bumblebird.location).toBe('play area');
                    expect(this.bumblebird.warded).toBe(false);
                });

                it('should not raise the tide', function () {
                    expect(this.player1.isTideHigh()).toBe(false);
                });
            });

            describe('and a creature is selected and destroyed', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.murkens);
                });

                it('should be in discard', function () {
                    expect(this.murkens.location).toBe('discard');
                });

                it('should raise the tide', function () {
                    expect(this.player1.isTideHigh()).toBe(true);
                    expect(this.player1.chains).toBe(0);
                });
            });
        });
    });
});
