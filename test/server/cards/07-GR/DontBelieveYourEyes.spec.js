describe("Don't Believe Your Eyes", function () {
    describe("Don't Believe Your Eyes's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    amber: 2,
                    hand: ['don-t-believe-your-eyes', 'soft-landing'],
                    inPlay: ['flaxia', 'blypyp'],
                    discard: new Array(9).fill('poke') // not haunted
                },
                player2: {
                    amber: 2,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        describe('when not haunted', function () {
            beforeEach(function () {
                this.player1.play(this.donTBelieveYourEyes);
            });

            it('should be able to select friendly creature and capture 1 from opponent', function () {
                this.player1.clickCard(this.flaxia);
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(1);
                expect(this.flaxia.amber).toBe(1);
            });

            it('should be able to select enemy creature and capture 1 from self', function () {
                this.player1.clickCard(this.gub);
                expect(this.player1.amber).toBe(1);
                expect(this.player2.amber).toBe(2);
                expect(this.gub.amber).toBe(1);
            });
        });

        describe('when haunted', function () {
            beforeEach(function () {
                this.player1.play(this.softLanding); // haunted
                this.player1.play(this.donTBelieveYourEyes);
            });
            it('should be able to select friendly creature and capture 2 from self', function () {
                this.player1.clickCard(this.blypyp);
                expect(this.player1.amber).toBe(0);
                expect(this.player2.amber).toBe(2);
                expect(this.blypyp.amber).toBe(2);
            });

            it('should be able to select enemy creature and capture 2 from opponent', function () {
                this.player1.clickCard(this.krump);
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(0);
                expect(this.krump.amber).toBe(2);
            });
        });

        it('should be able to select enemy creature when they have no amber', function () {
            this.player1.play(this.softLanding); // haunted
            this.player2.amber = 0;
            this.player1.play(this.donTBelieveYourEyes);
            this.player1.clickCard(this.krump);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            expect(this.krump.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
