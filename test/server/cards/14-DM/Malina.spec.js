describe('Malina', function () {
    describe("Malina's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['hemogrith', 'sibyl-waimare'],
                    inPlay: ['malina', 'urchin']
                },
                player2: {
                    hand: ['troll', 'bumpsy', 'krump', 'rowdy-skald', 'looter-goblin']
                }
            });
        });

        it('opponent cannot play creatures more powerful than the most powerful in play while exhausted', function () {
            this.malina.exhaust();
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
            this.malina.exhaust();
            this.player1.endTurn();
            this.player1.clickPrompt('done');
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.rowdySkald);
            expect(this.rowdySkald.location).toBe('play area');
            this.player2.play(this.looterGoblin);
            expect(this.looterGoblin.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });

        it('opponent can play creatures freely while Malina is ready', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.rowdySkald);
            expect(this.rowdySkald.location).toBe('play area');
            this.player2.play(this.troll);
            expect(this.troll.location).toBe('play area');
            this.player2.play(this.bumpsy);
            expect(this.bumpsy.location).toBe('play area');
            this.player2.play(this.krump);
            expect(this.krump.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });

        it("does not restrict Malina's controller from playing creatures of any power while exhausted", function () {
            this.malina.exhaust();
            this.player1.play(this.hemogrith);
            expect(this.hemogrith.location).toBe('play area');
            this.player1.play(this.sibylWaimare);
            expect(this.sibylWaimare.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
