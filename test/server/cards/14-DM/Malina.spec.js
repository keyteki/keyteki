describe('Malina', function () {
    describe("Malina's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['malina', 'urchin']
                },
                player2: {
                    hand: ['troll', 'bumpsy', 'krump']
                }
            });
        });

        it('opponent cannot play creatures more powerful than the most powerful in play while exhausted', function () {
            // urchin is 1 power, malina is 4, troll is 8, bumpsy is 5, krump is 6
            this.malina.exhausted = true;
            this.player1.endTurn();
            this.player1.clickPrompt('done');
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.troll);
            expect(this.player2).not.toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Cancel');
            expect(this.troll.location).toBe('hand');
            this.player2.clickCard(this.krump);
            expect(this.player2).not.toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Cancel');
            expect(this.krump.location).toBe('hand');
            expect(this.player2).isReadyToTakeAction();
        });

        it('opponent can play creatures equal to or less powerful than the most powerful in play while exhausted', function () {
            // malina is 4 power most powerful friendly
            this.malina.exhausted = true;
            this.player1.endTurn();
            this.player1.clickPrompt('done');
            this.player2.clickPrompt('brobnar');
            // bumpsy(5) > 4, blocked
            this.player2.clickCard(this.bumpsy);
            expect(this.player2).not.toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Cancel');
            // troll(8) > 4, blocked
            this.player2.clickCard(this.troll);
            expect(this.player2).not.toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Cancel');
            expect(this.player2).isReadyToTakeAction();
        });

        it('opponent can play creatures freely while Malina is ready', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.troll);
            expect(this.troll.location).toBe('play area');
            this.player2.play(this.bumpsy);
            expect(this.bumpsy.location).toBe('play area');
            this.player2.play(this.krump);
            expect(this.krump.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
