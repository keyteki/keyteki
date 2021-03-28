describe('Brobnar Plant', function () {
    describe("Brobnar Plant's constant effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['troll'],
                    hand: ['brobnar-plant', 'valdr']
                },
                player2: {
                    inPlay: ['lamindra'],
                    hand: ['krump', 'collar-of-subordination']
                }
            });
        });

        it('should gain amber when selecting brobnar', function () {
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);

            this.player1.playCreature(this.brobnarPlant);

            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');

            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);

            this.player2.endTurn();

            this.player1.clickPrompt('brobnar');

            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);

            this.player1.endTurn();
        });

        it('should not gain amber when not selecting brobnar', function () {
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);

            this.player1.playCreature(this.brobnarPlant);

            this.player1.endTurn();

            this.player2.clickPrompt('dis');

            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);

            this.player2.endTurn();

            this.player1.clickPrompt('shadows');

            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);

            this.player1.endTurn();
        });

        it('should gain amber after taking control', function () {
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);

            this.player1.playCreature(this.brobnarPlant);

            this.player1.endTurn();

            this.player2.clickPrompt('dis');
            this.player2.playUpgrade(this.collarOfSubordination, this.brobnarPlant);
            this.player2.clickPrompt('Left');

            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);

            this.player2.endTurn();

            this.player1.clickPrompt('brobnar');

            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);

            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');

            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);

            this.player2.endTurn();
        });
    });
});
