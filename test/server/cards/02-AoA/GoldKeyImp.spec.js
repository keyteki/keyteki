describe('Gold Key Imp', function () {
    describe("Gold Key Imp's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 12,
                    inPlay: ['gold-key-imp', 'obsidian-forge']
                },
                player2: {
                    amber: 6,
                    hand: ['gongoozle']
                }
            });
            this.player1.player.keys = { red: true, blue: true, yellow: false };
            this.player2.player.keys = { red: true, blue: true, yellow: false };
        });

        it('should prevent players from forging their third key', function () {
            this.player1.endTurn();
            expect(this.player1.player.getForgedKeys()).toBe(2);
            expect(this.player1.amber).toBe(12);

            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            expect(this.player2.player.getForgedKeys()).toBe(2);
            expect(this.player2.amber).toBe(6);
            this.player1.clickPrompt('dis');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow forging after gold key imp is destroyed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            expect(this.player2.player.getForgedKeys()).toBe(2);
            expect(this.player2.amber).toBe(6);
            this.player2.play(this.gongoozle);
            this.player2.clickCard(this.goldKeyImp);
            this.player2.endTurn();
            expect(this.player1.player.getForgedKeys()).toBe(3);
            expect(this.player1.amber).toBe(6);
        });

        it('should prevent forging third key with Obsidian Forge', function () {
            this.player1.useAction(this.obsidianForge);
            this.player1.clickPrompt('Done');
            expect(this.player1.player.getForgedKeys()).toBe(2);
            expect(this.player1.amber).toBe(12);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
