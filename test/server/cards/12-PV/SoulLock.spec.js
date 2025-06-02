describe('Soul Lock', function () {
    describe("Soul Lock's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['soul-lock'],
                    hand: ['ancient-bear', 'ancient-bear']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'urchin', 'gauntlet-of-command']
                }
            });
        });

        it('should prevent opponent from using cards of the same house as cards under it', function () {
            this.player1.useAction(this.soulLock);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('under');
            expect(this.troll.facedown).toBe(false);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.krump);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            this.player2.clickCard(this.gauntletOfCommand);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prevent opponent from using cards of a different house as cards under it', function () {
            this.player1.useAction(this.soulLock);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('under');
            expect(this.troll.facedown).toBe(false);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.reap(this.urchin);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should discard all cards under it when used', function () {
            this.player1.useAction(this.soulLock);
            this.player1.clickCard(this.troll);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.useAction(this.soulLock);
            this.player1.clickCard(this.urchin);
            expect(this.troll.location).toBe('discard');
            expect(this.urchin.location).toBe('under');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
