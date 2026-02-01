describe('Bronze Key Imp', function () {
    describe("Bronze Key Imp's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 6,
                    inPlay: ['bronze-key-imp']
                },
                player2: {
                    amber: 6,
                    hand: ['gongoozle']
                }
            });
        });

        it('should prevent players from forging their first key', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.player2.amber).toBe(6);
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            expect(this.player1.player.getForgedKeys()).toBe(0);
            expect(this.player1.amber).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow forging after bronze key imp is destroyed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.player2.amber).toBe(6);
            this.player2.play(this.gongoozle);
            this.player2.clickCard(this.bronzeKeyImp);
            this.player2.endTurn();
            this.player1.clickPrompt('Red');
            this.player1.clickPrompt('dis');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
