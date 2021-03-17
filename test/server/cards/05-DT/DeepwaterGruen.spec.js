describe('Deepwater Gruen', function () {
    describe("Deepwater Gruen's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'untamed',
                    hand: ['deepwater-gruen']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens']
                }
            });
        });

        describe('when the tide is neutral', function () {
            beforeEach(function () {
                this.player1.play(this.deepwaterGruen);
            });

            it('should not make opponent gain 1 amber', function () {
                expect(this.player1.amber).toBe(4);
                expect(this.player2.amber).toBe(2);
            });
        });

        describe('when the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
                this.player1.play(this.deepwaterGruen);
            });

            it('should make opponent gain 1 amber', function () {
                expect(this.player1.amber).toBe(4);
                expect(this.player2.amber).toBe(3);
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
                this.player1.play(this.deepwaterGruen);
            });

            it('should not make opponent gain 1 amber', function () {
                expect(this.player1.amber).toBe(4);
                expect(this.player2.amber).toBe(2);
            });
        });
    });

    describe("Deepwater Gruen's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'untamed',
                    inPlay: ['deepwater-gruen']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens']
                }
            });
        });

        describe('when the tide is neutral', function () {
            beforeEach(function () {
                this.player1.reap(this.deepwaterGruen);
            });

            it('should not make opponent gain 1 amber', function () {
                expect(this.player1.amber).toBe(3);
                expect(this.player2.amber).toBe(2);
            });
        });

        describe('when the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
                this.player1.reap(this.deepwaterGruen);
            });

            it('should make opponent gain 1 amber', function () {
                expect(this.player1.amber).toBe(3);
                expect(this.player2.amber).toBe(3);
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
                this.player1.reap(this.deepwaterGruen);
            });

            it('should not make opponent gain 1 amber', function () {
                expect(this.player1.amber).toBe(3);
                expect(this.player2.amber).toBe(2);
            });
        });
    });
});
