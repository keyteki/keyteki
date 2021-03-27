describe('T3r 35a', function () {
    describe("T3r 35a's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    hand: ['armsmaster-molina', 'dust-pixie', 't3r-35a', 'chronus'],
                    inPlay: []
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should play as an upgrade without issue', function () {
            this.player1.moveCard(this.chronus, 'play area');
            this.player1.playUpgrade(this.t3r35a, this.chronus);
            this.player1.endTurn();
        });

        it('should play as a creature without issue', function () {
            this.player1.playCreature(this.t3r35a);
            this.player1.endTurn();
        });

        it('should be able to be used when it is the turn of the creature on the left', function () {
            this.player1.moveCard(this.dustPixie, 'play area');
            this.player1.playCreature(this.t3r35a, false);

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');

            this.player1.amber = 1;
            this.player1.reap(this.t3r35a);
            expect(this.player1.amber).toBe(2);

            this.player1.endTurn();
        });

        it('should be able to be used when it is the turn of the creature on the right', function () {
            this.player1.moveCard(this.dustPixie, 'play area');
            this.player1.playCreature(this.t3r35a, true);

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');

            this.player1.amber = 1;
            this.player1.reap(this.t3r35a);
            expect(this.player1.amber).toBe(2);

            this.player1.endTurn();
        });

        it('should be able to be used when it is the turn of the creature on left right', function () {
            this.player1.playCreature(this.t3r35a, true);

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');

            // play untamed on left and use t3r
            this.player1.playCreature(this.dustPixie, true);
            this.player1.amber = 1;
            this.player1.reap(this.t3r35a);
            expect(this.player1.amber).toBe(2);

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');

            // play logos on left and use t3r
            this.player1.playCreature(this.chronus, false);
            this.player1.amber = 1;
            this.player1.reap(this.t3r35a);
            expect(this.player1.amber).toBe(2);

            // switch back to untamed make sure it still works
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.amber = 1;
            this.player1.reap(this.t3r35a);
            expect(this.player1.amber).toBe(2);

            // switch to sa and make sure it still works
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.amber = 1;
            this.player1.reap(this.t3r35a);
            expect(this.player1.amber).toBe(2);
        });

        it('upgraded creature should be able to be used when it is the turn of the creature on the left', function () {
            this.player1.moveCard(this.dustPixie, 'play area');
            this.player1.playCreature(this.armsmasterMolina, false);
            this.player1.playUpgrade(this.t3r35a, this.armsmasterMolina);

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');

            this.player1.amber = 1;
            this.player1.reap(this.armsmasterMolina);
            expect(this.player1.amber).toBe(2);

            this.player1.endTurn();
        });

        it('upgraded creature should be able to be used when it is the turn of the creature on the right', function () {
            this.player1.moveCard(this.dustPixie, 'play area');
            this.player1.playCreature(this.armsmasterMolina, true);
            this.player1.playUpgrade(this.t3r35a, this.armsmasterMolina);

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');

            this.player1.amber = 1;
            this.player1.reap(this.armsmasterMolina);
            expect(this.player1.amber).toBe(2);

            this.player1.endTurn();
        });

        it('upgraded creature should be able to be used when it is the turn of the creature on left right', function () {
            this.player1.playCreature(this.armsmasterMolina, true);
            this.player1.playUpgrade(this.t3r35a, this.armsmasterMolina);

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');

            // play untamed on left and use t3r
            this.player1.playCreature(this.dustPixie, true);
            this.player1.amber = 1;
            this.player1.reap(this.armsmasterMolina);
            expect(this.player1.amber).toBe(2);

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');

            // play logos on left and use t3r
            this.player1.playCreature(this.chronus, false);
            this.player1.amber = 1;
            this.player1.reap(this.armsmasterMolina);
            expect(this.player1.amber).toBe(2);

            // switch back to untamed make sure it still works
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.amber = 1;
            this.player1.reap(this.armsmasterMolina);
            expect(this.player1.amber).toBe(2);

            // switch to sa and make sure it still works
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.amber = 1;
            this.player1.reap(this.armsmasterMolina);
            expect(this.player1.amber).toBe(2);
        });
    });
});
