describe('Rock-Hurling Giant', function () {
    describe("Rock-Hurling Giant's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    inPlay: ['rock-hurling-giant'],
                    hand: ['loot-the-bodies', 'troll', 'sloppy-labwork']
                },
                player2: {
                    hand: ['mind-barb'],
                    inPlay: ['valdr']
                }
            });
        });

        it('should trigger from discarding cards', function () {
            this.player1.clickPrompt('brobnar');
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Discard this card');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.rockHurlingGiant);
            expect(this.player1).toHavePrompt('Rock-Hurling Giant');
            this.player1.clickCard(this.valdr);
            expect(this.valdr.tokens.damage).toBe(4);
            this.player1.clickCard(this.lootTheBodies);
            this.player1.clickPrompt('Discard this card');
            this.player1.clickCard(this.rockHurlingGiant);
            this.player1.clickCard(this.valdr);
            expect(this.valdr.location).toBe('discard');
        });

        it('should trigger from discards due to card effects', function () {
            this.player1.clickPrompt('logos');
            this.player1.play(this.sloppyLabwork);
            expect(this.player1).toHavePrompt('Sloppy Labwork');
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt('Sloppy Labwork');
            this.player1.clickCard(this.lootTheBodies);
            expect(this.player1).toHavePrompt('Triggered Abilities');
        });

        it("should not trigger during opponent's turn", function () {
            this.player1.player.chains = 19;
            this.player1.clickPrompt('logos');
            this.player1.clickCard(this.sloppyLabwork);
            this.player1.clickPrompt('Discard this card');
            this.player1.endTurn();
            expect(this.player1.hand.length).toBe(2);
            this.player2.clickPrompt('dis');
            this.player2.play(this.mindBarb);
            expect(this.player1.hand.length).toBe(1);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
