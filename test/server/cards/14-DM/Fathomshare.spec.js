describe('Fathomshare', function () {
    describe("Fathomshare's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['fathomshare'],
                    inPlay: ['urchin', 'silvertooth']
                },
                player2: {
                    inPlay: ['troll'],
                    amber: 7
                }
            });
        });

        it("captures half of opponent's amber rounding down distributed among friendly creatures", function () {
            this.player1.play(this.fathomshare);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.silvertooth);
            this.player1.clickCard(this.urchin);
            const total = this.urchin.amber + this.silvertooth.amber;
            expect(total).toBe(3);
            expect(this.troll.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if opponent has fewer than 2 amber', function () {
            this.player2.amber = 1;
            this.player1.play(this.fathomshare);
            expect(this.urchin.amber).toBe(0);
            expect(this.silvertooth.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if there are no friendly creatures to capture onto', function () {
            this.player1.player.moveCard(this.urchin, 'discard');
            this.player1.player.moveCard(this.silvertooth, 'discard');
            this.player1.play(this.fathomshare);
            expect(this.player2.amber).toBe(7);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Fathomshare with Essence Entangler', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['fathomshare', 'essence-entangler'],
                    inPlay: ['urchin', 'silvertooth']
                },
                player2: {}
            });
        });

        it('does not resolve captures until all selections are made', function () {
            this.player1.playUpgrade(this.essenceEntangler, this.urchin);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            this.player2.amber = 7;
            this.player1.play(this.fathomshare);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('play area');
            expect(this.urchin.amber).toBe(0);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('play area');
            expect(this.urchin.amber).toBe(0);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.urchin.amber).toBe(0);
            expect(this.player2.amber).toBe(7);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
