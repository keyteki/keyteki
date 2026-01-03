describe('Sample 42-C', function () {
    describe("Sample 42-C's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'staralliance',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    inPlay: [
                        'sample-42-c',
                        'culf-the-quiet',
                        'brutodon-auxiliary',
                        'helmsman-spears'
                    ]
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump', 'ember-imp', 'troll']
                }
            });
        });

        it('should move 1 amber from opponent to itself', function () {
            this.player1.useAction(this.sample42C);
            expect(this.player2.amber).toBe(3);
            expect(this.sample42C.amber).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should forge a key and purge itself when it has 4 or more amber', function () {
            // Add 4 amber to Sample 42-C
            this.sample42C.amber = 3;
            this.player1.useAction(this.sample42C);

            expect(this.player2.amber).toBe(3);
            expect(this.sample42C.amber).toBe(4);
            this.player1.forgeKey('red');
            expect(this.player1.amber).toBe(6);
            expect(this.player1.getForgedKeys()).toBe(1);
            expect(this.sample42C.location).toBe('purged');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should have the most powerful enemy creature capture half of your amber when fate is triggered', function () {
            this.player1.moveCard(this.sample42C, 'hand');
            this.player1.activateProphecy(this.overreach, this.sample42C);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.player2).toBeAbleToSelect(this.culfTheQuiet);
            expect(this.player2).toBeAbleToSelect(this.brutodonAuxiliary);
            expect(this.player2).not.toBeAbleToSelect(this.helmsmanSpears);
            expect(this.player2).not.toBeAbleToSelect(this.krump);
            expect(this.player2).not.toBeAbleToSelect(this.emberImp);
            expect(this.player2).not.toBeAbleToSelect(this.troll);
            this.player2.clickCard(this.culfTheQuiet);
            expect(this.culfTheQuiet.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.sample42C.location).toBe('discard');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
