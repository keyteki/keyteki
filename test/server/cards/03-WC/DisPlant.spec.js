describe('Dis Plant', function() {
    integration(function() {
        describe('Dis Plant\'s constant effect', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'shadows',
                        inPlay: ['troll'],
                        hand: ['dis-plant', 'hecatomb']
                    },
                    player2: {
                        inPlay: ['lamindra'],
                        hand: ['bloodshard-imp', 'hypnobeam']
                    }
                });
            });

            it('Should get amber when selecting dis', function() {
                expect(this.player1.amber).toBe(0);
                expect(this.player2.amber).toBe(0);

                this.player1.playCreature(this.disPlant);

                this.player1.endTurn();

                this.player2.clickPrompt('dis');

                expect(this.player1.amber).toBe(1);
                expect(this.player2.amber).toBe(0);

                this.player2.endTurn();

                this.player1.clickPrompt('dis');

                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(0);

                this.player1.endTurn();
            });

            it('Should not get amber when not selecting dis', function() {
                expect(this.player1.amber).toBe(0);
                expect(this.player2.amber).toBe(0);

                this.player1.playCreature(this.disPlant);

                this.player1.endTurn();

                this.player2.clickPrompt('mars');

                expect(this.player1.amber).toBe(0);
                expect(this.player2.amber).toBe(0);

                this.player2.endTurn();

                this.player1.clickPrompt('shadows');

                expect(this.player1.amber).toBe(0);
                expect(this.player2.amber).toBe(0);

                this.player1.endTurn();
            });

            it('Controller get amber after taking control', function() {
                expect(this.player1.amber).toBe(0);
                expect(this.player2.amber).toBe(0);

                this.player1.playCreature(this.disPlant);

                this.player1.endTurn();

                this.player2.clickPrompt('mars');
                this.player2.play(this.hypnobeam);
                this.player2.clickCard(this.disPlant);
                this.player2.clickPrompt('Left');

                expect(this.player1.amber).toBe(0);
                expect(this.player2.amber).toBe(0);

                this.player2.endTurn();

                this.player1.clickPrompt('dis');

                expect(this.player1.amber).toBe(0);
                expect(this.player2.amber).toBe(1);

                this.player1.endTurn();

                this.player2.clickPrompt('dis');

                expect(this.player1.amber).toBe(0);
                expect(this.player2.amber).toBe(2);

                this.player2.endTurn();
            });
        });
    });
});
