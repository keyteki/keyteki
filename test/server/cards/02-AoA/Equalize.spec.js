describe('Equalize', function () {
    describe("Equalize's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 3,
                    hand: ['drumble', 'charette'],
                    inPlay: ['the-terror', 'tentacus']
                },
                player2: {
                    amber: 12,
                    hand: ['aubade-the-grim', 'equalize'],
                    inPlay: ['commander-remiel', 'bulwark', 'sequis']
                }
            });
        });

        it('should not redistribute any amber if creatures have no amber', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('Red');
            this.player2.clickPrompt('sanctum');
            this.player2.play(this.equalize);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should let a player redistribute all amber', function () {
            this.player1.play(this.charette);
            this.player1.play(this.drumble);
            expect(this.charette.tokens.amber).toBe(3);
            expect(this.drumble.tokens.amber).toBe(9);
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.play(this.equalize);
            expect(this.player2).toHavePrompt('Equalize');
            expect(this.player2).toBeAbleToSelect(this.drumble);
            expect(this.player2).toBeAbleToSelect(this.charette);
            expect(this.player2).toBeAbleToSelect(this.theTerror);
            expect(this.player2).toBeAbleToSelect(this.tentacus);
            this.player2.clickCard(this.drumble);
            expect(this.drumble.tokens.amber).toBe(1);
            this.player2.clickCard(this.drumble);
            expect(this.drumble.tokens.amber).toBe(2);
            this.player2.clickCard(this.drumble);
            this.player2.clickCard(this.drumble);
            this.player2.clickCard(this.drumble);
            this.player2.clickCard(this.drumble);
            this.player2.clickCard(this.drumble);
            this.player2.clickCard(this.drumble);
            this.player2.clickCard(this.drumble);
            this.player2.clickCard(this.drumble);
            this.player2.clickCard(this.tentacus);
            this.player2.clickCard(this.charette);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            expect(this.drumble.tokens.amber).toBe(10);
            expect(this.tentacus.tokens.amber).toBe(1);
            expect(this.charette.tokens.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });

        it("should let a player redistribute all amber even if it's on both sides", function () {
            this.player1.play(this.charette);
            this.player1.play(this.drumble);
            expect(this.charette.tokens.amber).toBe(3);
            expect(this.drumble.tokens.amber).toBe(9);
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.play(this.aubadeTheGrim);
            this.player2.play(this.equalize);
            expect(this.player2).toHavePrompt('Equalize');
            expect(this.player2).not.toBeAbleToSelect(this.charette);
            expect(this.player2).toBeAbleToSelect(this.bulwark);
            this.player2.clickCard(this.bulwark);
            this.player2.clickCard(this.bulwark);
            this.player2.clickCard(this.sequis);
            expect(this.player2).not.toBeAbleToSelect(this.bulwark);
            expect(this.player2).toBeAbleToSelect(this.drumble);
            expect(this.player2).toBeAbleToSelect(this.charette);
            expect(this.player2).toBeAbleToSelect(this.theTerror);
            expect(this.player2).toBeAbleToSelect(this.tentacus);
            this.player2.clickCard(this.drumble);
            expect(this.drumble.tokens.amber).toBe(1);
            this.player2.clickCard(this.drumble);
            expect(this.drumble.tokens.amber).toBe(2);
            this.player2.clickCard(this.drumble);
            this.player2.clickCard(this.drumble);
            this.player2.clickCard(this.drumble);
            this.player2.clickCard(this.drumble);
            this.player2.clickCard(this.drumble);
            this.player2.clickCard(this.drumble);
            this.player2.clickCard(this.drumble);
            this.player2.clickCard(this.drumble);
            this.player2.clickCard(this.tentacus);
            this.player2.clickCard(this.charette);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            expect(this.drumble.tokens.amber).toBe(10);
            expect(this.tentacus.tokens.amber).toBe(1);
            expect(this.charette.tokens.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });
    });
});
