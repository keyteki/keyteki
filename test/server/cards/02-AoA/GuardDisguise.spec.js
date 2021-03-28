describe('Guard Disguise', function () {
    describe("Guard Disguise's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'shadows',
                    hand: ['urchin', 'magda-the-rat'],
                    inPlay: ['guard-disguise', 'umbra', 'murmook']
                },
                player2: {
                    amber: 6,
                    hand: ['remote-access', 'binate-rupture'],
                    inPlay: ['bad-penny', 'nexus']
                }
            });
        });

        it('should be usable and not steal if the opponent has more than 3, but should be sacrificed', function () {
            this.player1.clickCard(this.guardDisguise);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.guardDisguise.location).toBe('discard');
            expect(this.player2.amber).toBe(6);
        });

        it('should steal if the opponent has 3 or more', function () {
            this.player1.play(this.magdaTheRat);
            this.player1.play(this.urchin);
            this.player1.clickCard(this.guardDisguise);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.guardDisguise.location).toBe('discard');
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(9);
        });

        it('should work the same when used by the opponent', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.remoteAccess);
            this.player2.clickCard(this.guardDisguise);
            expect(this.guardDisguise.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(10);
        });

        it('should work the same when used by the opponent even if it would not steal', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.binateRupture);
            this.player2.play(this.remoteAccess);
            this.player2.clickCard(this.guardDisguise);
            expect(this.guardDisguise.location).toBe('discard');
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(13);
        });
    });
});
