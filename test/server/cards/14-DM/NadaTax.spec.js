describe('NadaTax', function () {
    describe("Nada Tax's ability", function () {
        it('makes opponent lose 1 amber per bonus icon on discarded card', function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['nada-tax']
                },
                player2: {
                    amber: 3,
                    hand: ['caught-you-napping']
                }
            });
            this.player1.play(this.nadaTax);
            expect(this.caughtYouNapping.location).toBe('discard');
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not lose amber when discarded card has no bonus icons', function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['nada-tax']
                },
                player2: {
                    amber: 3,
                    hand: ['troll']
                }
            });
            this.player1.play(this.nadaTax);
            expect(this.troll.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if opponent has empty hand', function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['nada-tax']
                },
                player2: {
                    amber: 3
                }
            });
            this.player1.play(this.nadaTax);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('makes opponent lose 1 amber per bonus icon when card has multiple amber bonus icons', function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['nada-tax']
                },
                player2: {
                    amber: 5,
                    hand: ['virtuous-works']
                }
            });
            this.player1.play(this.nadaTax);
            expect(this.virtuousWorks.location).toBe('discard');
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('makes opponent lose amber for house enhancements on the discarded card', function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['nada-tax']
                },
                player2: {
                    amber: 5,
                    hand: ['troll']
                }
            });
            this.troll.enhancements = ['amber', 'capture'];
            this.player1.play(this.nadaTax);
            expect(this.troll.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
