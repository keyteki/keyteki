describe('Replay Pod', function () {
    describe("Replay Pod's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['ammonia-clouds'],
                    inPlay: ['replay-pod', 'yxilo-bolter', 'john-smyth', 'blypyp', 'pelf']
                },
                player2: {
                    inPlay: ['yxili-marauder']
                }
            });
        });

        it('should give all friendly mars creatures a destroyed ability', function () {
            this.player1.play(this.ammoniaClouds);
            this.player1.clickCard(this.yxiloBolter);
            this.player1.clickCard(this.johnSmyth);
            expect(this.replayPod.childCards).toContain(this.yxiloBolter);
            expect(this.replayPod.childCards).toContain(this.johnSmyth);
            expect(this.replayPod.childCards).toContain(this.blypyp);
            expect(this.pelf.location).toBe('discard');
            expect(this.yxiliMarauder.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should return cards to hand and purge itself', function () {
            this.player1.play(this.ammoniaClouds);
            this.player1.clickCard(this.yxiloBolter);
            this.player1.clickCard(this.johnSmyth);
            this.player1.useAction(this.replayPod);
            expect(this.yxiloBolter.location).toBe('hand');
            expect(this.johnSmyth.location).toBe('hand');
            expect(this.blypyp.location).toBe('hand');
            expect(this.pelf.location).toBe('discard');
            expect(this.yxiliMarauder.location).toBe('discard');
            expect(this.replayPod.location).toBe('purged');
        });
    });
});
