describe('Magda the Rat', function () {
    describe("Magda the Rat's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['magda-the-rat', 'loot-the-bodies', 'ballcano']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll', 'bumpsy', 'slimy-jark'],
                    hand: ['hysteria']
                }
            });
        });

        it('should steal when coming into play', function () {
            this.player2.amber = 1;
            this.player1.play(this.magdaTheRat);
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
        });

        it("should allow opponent to steal when leaving play during controller's turn", function () {
            this.player1.play(this.magdaTheRat);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.amber).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.fightWith(this.magdaTheRat, this.troll);
            expect(this.magdaTheRat.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
            expect(this.player1.amber).toBe(0);
        });

        it("should allow opponent to steal when leaving play during opponent's turn", function () {
            this.player1.play(this.magdaTheRat);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.amber).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.bumpsy, this.magdaTheRat);
            this.player2.fightWith(this.troll, this.magdaTheRat);
            expect(this.magdaTheRat.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
            expect(this.player1.amber).toBe(0);
        });

        it("should allow opponent to steal when returned to hand on opponent's turn", function () {
            this.player1.play(this.magdaTheRat);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.amber).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.hysteria);
            expect(this.magdaTheRat.location).toBe('hand');
            expect(this.player2.amber).toBe(3);
            expect(this.player1.amber).toBe(0);
        });

        it("should allow opponent to steal when returned to hand on opponent's turn and should not accumulate", function () {
            this.player1.amber = 5;
            for (let i = 0; i < 5; ++i) {
                this.player1.play(this.magdaTheRat);
                expect(this.player2.amber).toBe(1);
                expect(this.player1.amber).toBe(7);
                this.player1.endTurn();
                this.player2.clickPrompt('dis');
                this.player2.play(this.hysteria);
                expect(this.magdaTheRat.location).toBe('hand');
                expect(this.player2.amber).toBe(3);
                expect(this.player1.amber).toBe(5);
                this.player2.endTurn();
                this.player1.clickPrompt('shadows');
                this.player2.moveCard(this.hysteria, 'hand');
            }
        });

        it('should concur with Loot the Bodies and be able to choose Magda first', function () {
            this.player1.play(this.magdaTheRat);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.amber = 1;
            this.player2.amber = 1;
            this.player1.play(this.lootTheBodies);
            this.player1.play(this.ballcano);
            this.player1.clickPrompt('Magda the Rat');
            expect(this.slimyJark.location).toBe('discard');
            expect(this.magdaTheRat.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();
        });

        it('should concur with Loot the Bodies and be able to choose Loot the Bodies first', function () {
            this.player1.play(this.magdaTheRat);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.amber = 1;
            this.player2.amber = 1;
            this.player1.play(this.lootTheBodies);
            this.player1.play(this.ballcano);
            this.player1.clickPrompt('Loot the Bodies');
            expect(this.slimyJark.location).toBe('discard');
            expect(this.magdaTheRat.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            this.player1.endTurn();
        });
    });
});
