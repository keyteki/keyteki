describe('Pyrotechnic Flash', function () {
    describe("Pyrotechnic Flash's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['pyrotechnic-flash']
                },
                player2: {
                    amber: 3,
                    inPlay: ['urchin', 'lamindra', 'urchin']
                }
            });
            this.urchin1 = this.player2.player.cardsInPlay[0];
            this.urchin2 = this.player2.player.cardsInPlay[2];
        });

        it('deals 2 to a creature with 1 splash and steals 1 if 2+ destroyed', function () {
            this.player1.play(this.pyrotechnicFlash);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.location).toBe('discard');
            expect(this.urchin1.location).toBe('discard');
            expect(this.urchin2.location).toBe('discard');
            expect(this.player1.amber).toBe(1); // 1 stolen
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not steal if fewer than 2 creatures are destroyed', function () {
            this.player2.moveCard(this.urchin1, 'hand');
            this.player2.moveCard(this.urchin2, 'hand');
            this.player1.play(this.pyrotechnicFlash);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Pyrotechnic Flash with friendly creature kills', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['pyrotechnic-flash'],
                    inPlay: ['urchin', 'lamindra', 'urchin']
                },
                player2: {
                    amber: 3
                }
            });
            this.friendlyUrchin1 = this.player1.player.cardsInPlay[0];
            this.friendlyUrchin2 = this.player1.player.cardsInPlay[2];
        });

        it('steals when killing friendly creatures via splash', function () {
            this.player1.play(this.pyrotechnicFlash);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.location).toBe('discard');
            expect(this.friendlyUrchin1.location).toBe('discard');
            expect(this.friendlyUrchin2.location).toBe('discard');
            expect(this.player1.amber).toBe(1); // 1 stolen
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
