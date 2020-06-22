describe('Lash of Broken Dreams', function () {
    describe("Lash of Broken Dreams's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'dis',
                    inPlay: ['lash-of-broken-dreams']
                },
                player2: {
                    amber: 6,
                    hand: ['remote-access']
                }
            });
        });

        it('should stop a key being forged', function () {
            this.player1.clickCard(this.lashOfBrokenDreams);
            this.player1.clickPrompt("Use this card's Action ability");
            this.player1.endTurn();
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.player2.player.amber).toBe(6);
        });

        it('should work with Remote Access', function () {
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('logos');
            this.player2.play(this.remoteAccess);
            this.player2.clickCard(this.lashOfBrokenDreams);
            this.player2.endTurn();
            expect(this.player1.player.getForgedKeys()).toBe(0);
            expect(this.player1.player.amber).toBe(6);
        });
    });
});
