describe('Soul Lock', function () {
    describe("Soul Lock's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['soul-lock', 'library-of-the-damned', 'searine']
                },
                player2: {
                    hand: ['skippy-the-glorious', 'the-grey-rider'],
                    inPlay: ['troll', 'krump', 'dextre', 'barrister-joya', 'gauntlet-of-command']
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
            this.player2.clickPrompt('logos');
            this.player2.reap(this.dextre);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should discard all cards under it when used', function () {
            this.player1.useAction(this.soulLock);
            this.player1.clickCard(this.troll);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.useAction(this.soulLock);
            this.player1.clickCard(this.dextre);
            expect(this.troll.location).toBe('discard');
            expect(this.dextre.location).toBe('under');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be usable by opponent via scrap', function () {
            this.player1.useAction(this.soulLock);
            this.player1.clickCard(this.dextre);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.scrap(this.skippyTheGlorious);
            expect(this.player2).toBeAbleToSelect(this.soulLock);
            this.player2.clickCard(this.soulLock);
            this.player2.clickCard(this.searine);
            expect(this.soulLock.exhausted).toBe(true);
            expect(this.searine.location).toBe('under');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow use of other cards triggered by cards of the locked house', function () {
            this.player1.useAction(this.soulLock);
            this.player1.clickCard(this.barristerJoya);
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.playCreature(this.theGreyRider, true);
            this.player2.clickCard(this.theGreyRider);
            this.player2.clickCard(this.troll);
            this.player2.clickCard(this.searine);
            expect(this.searine.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
