describe('Shakedown Sullivan', function () {
    describe("ShakedownSullivan's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    inPlay: ['shakedown-sullivan', 'bumpsy'],
                    hand: ['pelf']
                },
                player2: {
                    amber: 1,
                    inPlay: ['batdrone', 'urchin'],
                    hand: ['labwork']
                }
            });
        });

        it('should gain an amber on friendly house match', function () {
            this.player1.moveCard(this.pelf, 'deck');
            this.player1.reap(this.shakedownSullivan);
            this.player1.clickCard(this.bumpsy);
            expect(this.player1.amber).toBe(3);
            expect(this.bumpsy.location).toBe('play area');
            expect(this.pelf.location).toBe('discard');
        });

        it('should destroy the creature on friendly house mismatch', function () {
            this.player1.moveCard(this.pelf, 'deck');
            this.player1.reap(this.shakedownSullivan);
            this.player1.clickCard(this.shakedownSullivan);
            expect(this.player1.amber).toBe(2);
            expect(this.shakedownSullivan.location).toBe('discard');
            expect(this.pelf.location).toBe('discard');
        });

        it('should gain an amber on enemy house match', function () {
            this.player2.moveCard(this.labwork, 'deck');
            this.player1.reap(this.shakedownSullivan);
            this.player1.clickCard(this.batdrone);
            expect(this.player2.amber).toBe(2);
            expect(this.batdrone.location).toBe('play area');
            expect(this.labwork.location).toBe('discard');
        });

        it('should destroy the creature on enemy house mismatch', function () {
            this.player2.moveCard(this.labwork, 'deck');
            this.player1.reap(this.shakedownSullivan);
            this.player1.clickCard(this.urchin);
            expect(this.player2.amber).toBe(1);
            expect(this.urchin.location).toBe('discard');
            expect(this.labwork.location).toBe('discard');
        });
    });
});
