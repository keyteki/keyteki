describe('Curse Of Confusion', function () {
    describe("Curse Of Confusion's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['curse-of-confusion']
                },
                player2: {
                    hand: ['ether-spider'],
                    inPlay: ['john-smyth', 'commander-chan']
                }
            });
        });

        it('should enter play under opponents control', function () {
            this.player1.play(this.curseOfConfusion);
            expect(this.curseOfConfusion.location).toBe('play area');
            expect(this.player1.player.cardsInPlay).not.toContain(this.curseOfConfusion);
            expect(this.player2.player.cardsInPlay).toContain(this.curseOfConfusion);
        });

        it('should exhaust creatures of the opponents active house', function () {
            this.player1.play(this.curseOfConfusion);
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.reap(this.commanderChan);
            this.player2.clickCard(this.johnSmyth);
            expect(this.commanderChan.exhausted).toBe(true);
            expect(this.johnSmyth.exhausted).toBe(true);
            this.player2.endTurn();
            expect(this.commanderChan.exhausted).toBe(true);
            expect(this.johnSmyth.exhausted).toBe(false);
        });

        it('should exhaust newly-played creatures too', function () {
            this.player1.play(this.curseOfConfusion);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.reap(this.johnSmyth);
            this.player2.playCreature(this.etherSpider);
            expect(this.johnSmyth.exhausted).toBe(true);
            expect(this.etherSpider.exhausted).toBe(true);
            this.player2.endTurn();
            expect(this.johnSmyth.exhausted).toBe(true);
            expect(this.etherSpider.exhausted).toBe(true);
        });
    });
});
