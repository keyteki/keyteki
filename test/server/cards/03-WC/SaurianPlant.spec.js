describe('Saurian Plant', function () {
    describe("Saurian Plant's constant effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['troll'],
                    hand: ['saurian-plant', 'imperium']
                },
                player2: {
                    inPlay: ['lamindra'],
                    hand: ['axiom-of-grisk', 'collar-of-subordination']
                }
            });
        });

        it('should gain amber when selecting saurian', function () {
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);

            this.player1.playCreature(this.saurianPlant);

            this.player1.endTurn();

            this.player2.clickPrompt('saurian');

            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);

            this.player2.endTurn();

            this.player1.clickPrompt('saurian');

            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);

            this.player1.endTurn();
        });

        it('should not gain amber when not selecting saurian', function () {
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);

            this.player1.playCreature(this.saurianPlant);

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

            this.player1.playCreature(this.saurianPlant);

            this.player1.endTurn();

            this.player2.clickPrompt('dis');
            this.player2.playUpgrade(this.collarOfSubordination, this.saurianPlant);
            this.player2.clickPrompt('Left');

            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);

            this.player2.endTurn();

            this.player1.clickPrompt('saurian');

            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);

            this.player1.endTurn();

            this.player2.clickPrompt('saurian');

            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);

            this.player2.endTurn();
        });
    });
});
