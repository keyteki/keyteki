describe('Silver Key Imp', function () {
    describe("Silver Key Imp's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 12,
                    inPlay: ['silver-key-imp', 'obsidian-forge']
                },
                player2: {
                    amber: 6,
                    hand: ['gongoozle']
                }
            });
            this.player1.player.keys = { red: true, blue: false, yellow: false };
            this.player2.player.keys = { red: true, blue: false, yellow: false };
        });

        it('should prevent players from forging their second key', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            expect(this.player2.player.getForgedKeys()).toBe(1);
            expect(this.player2.amber).toBe(6);
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1.amber).toBe(12);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow forging after silver key imp is destroyed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            expect(this.player2.player.getForgedKeys()).toBe(1);
            expect(this.player2.amber).toBe(6);
            this.player2.play(this.gongoozle);
            this.player2.clickCard(this.silverKeyImp);
            this.player2.endTurn();
            this.player1.clickPrompt('Blue');
            this.player1.clickPrompt('dis');
            expect(this.player1.player.getForgedKeys()).toBe(2);
            expect(this.player1.amber).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should prevent forging second key with Obsidian Forge', function () {
            this.player1.useAction(this.obsidianForge);
            this.player1.clickPrompt('Done');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1.amber).toBe(12);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
