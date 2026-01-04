describe('Quartermaster Botty', function () {
    describe("Quartermaster Botty's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['quartermaster-botty', 'stealth-mode'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 4,
                    inPlay: ['batdrone']
                }
            });
            this.player1.chains = 36;
        });

        it('does nothing when not haunted', function () {
            this.player1.play(this.quartermasterBotty);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('captures 2 when haunted on play', function () {
            this.player1.play(this.stealthMode);
            this.player1.play(this.quartermasterBotty);
            expect(this.quartermasterBotty.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('captures 2 when haunted on reap', function () {
            this.player1.play(this.quartermasterBotty);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.play(this.stealthMode);
            this.player1.reap(this.quartermasterBotty);
            expect(this.quartermasterBotty.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('captures 2 when haunted on fight', function () {
            this.player1.play(this.quartermasterBotty);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.play(this.stealthMode);
            this.player1.fightWith(this.quartermasterBotty, this.batdrone);
            expect(this.quartermasterBotty.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
