describe('Guji Dinosaur Hunter', function () {
    describe("Guji Dinosaur Hunter's action ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['guji-dinosaur-hunter']
                },
                player2: {
                    amber: 4,
                    hand: ['raiding-knight'],
                    inPlay: ['legatus-raptor', 'krump']
                }
            });
        });
        it('should deal two damage with its action ability to a non dino/exalt/capture.', function () {
            this.player1.clickCard(this.gujiDinosaurHunter);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Guji Dinosaur Hunter');
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.legatusRaptor);
            expect(this.player1).toBeAbleToSelect(this.gujiDinosaurHunter);
            this.player1.clickCard(this.krump);
            expect(this.krump.location).toBe('play area');
            expect(this.krump.tokens.damage).toBe(2);
        });
        it('should deal 6 damage with its action ability to a dino', function () {
            this.player1.clickCard(this.gujiDinosaurHunter);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Guji Dinosaur Hunter');
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.legatusRaptor);
            expect(this.player1).toBeAbleToSelect(this.gujiDinosaurHunter);
            this.player1.clickCard(this.legatusRaptor);
            expect(this.legatusRaptor.location).toBe('discard');
        });
        it('should deal 6 damage with its action ability to a dino', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.play(this.raidingKnight);
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.clickCard(this.gujiDinosaurHunter);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Guji Dinosaur Hunter');
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.legatusRaptor);
            expect(this.player1).toBeAbleToSelect(this.gujiDinosaurHunter);
            expect(this.player1).toBeAbleToSelect(this.raidingKnight);
            this.player1.clickCard(this.raidingKnight);
            expect(this.raidingKnight.location).toBe('discard');
        });
    });
});
