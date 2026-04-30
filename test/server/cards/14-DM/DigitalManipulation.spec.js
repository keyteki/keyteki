describe('Digital Manipulation', function () {
    describe('when top of opponent deck is non-Mars', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['digital-manipulation']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll', 'bumpsy'],
                    hand: ['urchin']
                }
            });
            this.player2.moveCard(this.urchin, 'deck');
        });

        it('captures 1 onto a chosen enemy creature', function () {
            this.player1.play(this.digitalManipulation);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose an enemy creature');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.troll);
            expect(this.troll.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when top of opponent deck is Mars', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['digital-manipulation']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll'],
                    hand: ['john-smyth']
                }
            });
            this.player2.moveCard(this.johnSmyth, 'deck');
        });

        it('does not capture', function () {
            this.player1.play(this.digitalManipulation);
            expect(this.johnSmyth.location).toBe('discard');
            expect(this.troll.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when top of opponent deck is a non-Mars card with a Mars enhancement', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['digital-manipulation']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll'],
                    hand: ['urchin']
                }
            });
            this.urchin.enhancements = ['mars'];
            this.player2.moveCard(this.urchin, 'deck');
        });

        it('does not capture', function () {
            this.player1.play(this.digitalManipulation);
            expect(this.urchin.location).toBe('discard');
            expect(this.troll.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("when opponent's deck is empty", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['digital-manipulation']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll']
                }
            });
            for (const card of this.player2.player.deck.slice()) {
                this.player2.moveCard(card, 'discard');
            }
        });

        it('does not capture', function () {
            this.player1.play(this.digitalManipulation);
            expect(this.troll.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when opponent has no creatures', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['digital-manipulation']
                },
                player2: {
                    amber: 3,
                    hand: ['urchin']
                }
            });
            this.player2.moveCard(this.urchin, 'deck');
        });

        it('discards the top card but cannot capture', function () {
            this.player1.play(this.digitalManipulation);
            expect(this.urchin.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
