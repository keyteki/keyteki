describe('Logos Plant', function () {
    describe("Logos Plant's constant effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['troll'],
                    hand: ['logos-plant', 'helper-bot']
                },
                player2: {
                    inPlay: ['archimedes'],
                    hand: ['dextre', 'collar-of-subordination']
                }
            });
        });

        it('should gain amber when selecting logos', function () {
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);

            this.player1.playCreature(this.logosPlant);

            this.player1.endTurn();

            this.player2.clickPrompt('logos');

            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);

            this.player2.endTurn();

            this.player1.clickPrompt('logos');

            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);

            this.player1.endTurn();
        });

        it('should not gain amber when not selecting logos', function () {
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);

            this.player1.playCreature(this.logosPlant);

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

            this.player1.playCreature(this.logosPlant);

            this.player1.endTurn();

            this.player2.clickPrompt('dis');
            this.player2.playUpgrade(this.collarOfSubordination, this.logosPlant);
            this.player2.clickPrompt('Left');

            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);

            this.player2.endTurn();

            this.player1.clickPrompt('logos');

            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);

            this.player1.endTurn();

            this.player2.clickPrompt('logos');

            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);

            this.player2.endTurn();
        });
    });
});
