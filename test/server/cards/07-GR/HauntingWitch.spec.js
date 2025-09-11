describe('Haunting Witch', function () {
    describe("Haunting Witch's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    hand: ['haunting-witch', 'tantadlin', 'fertility-chant'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 1,
                    hand: ['troll']
                }
            });
            this.player1.chains = 36;
        });

        it('does not gain amber when not haunted', function () {
            expect(this.player1.amber).toBe(1);
            this.player1.playCreature(this.hauntingWitch);
            expect(this.player1.amber).toBe(1);
            this.player1.playCreature(this.tantadlin);
            expect(this.player1.amber).toBe(1);
        });

        it('does gain amber when haunted', function () {
            expect(this.player1.amber).toBe(1);
            this.player1.playCreature(this.hauntingWitch);
            expect(this.player1.amber).toBe(1);
            this.player1.play(this.fertilityChant);
            expect(this.player1.amber).toBe(5);
            this.player1.play(this.tantadlin);
            expect(this.player1.amber).toBe(6);
        });

        it('gains amber for self when haunted', function () {
            expect(this.player1.amber).toBe(1);
            this.player1.play(this.fertilityChant);
            expect(this.player1.amber).toBe(5);
            this.player1.playCreature(this.hauntingWitch);
            expect(this.player1.amber).toBe(6);
        });

        it('does not gain amber for opponent', function () {
            this.player1.playCreature(this.hauntingWitch);
            this.player1.play(this.fertilityChant);
            expect(this.player1.amber).toBe(5);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.player2.amber).toBe(3);
            this.player2.playCreature(this.troll);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(3);
        });
    });
});
