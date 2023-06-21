describe('Edict of Nerotaurus', function () {
    describe("Edict of Nerotaurus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: [
                        'edict-of-nerotaurus',
                        'scylla',
                        'brutodon-auxiliary',
                        'cornicen-octavia',
                        'saurian-egg'
                    ]
                },
                player2: {
                    inPlay: ['umbra', 'dodger', 'mack-the-knife']
                }
            });
        });

        it('should not allow two reaps in a row', function () {
            this.player1.reap(this.scylla);
            this.player1.clickCard(this.brutodonAuxiliary);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
        });

        it('should not allow two fights in a row', function () {
            this.player1.fightWith(this.scylla, this.umbra);
            this.player1.clickCard(this.brutodonAuxiliary);
            expect(this.player1).not.toHavePromptButton('Fight with this creature');
        });

        it('should allow another reap after a fight', function () {
            this.player1.reap(this.scylla);
            this.player1.fightWith(this.brutodonAuxiliary, this.umbra);
            this.player1.reap(this.cornicenOctavia);
        });

        it('should allow another fight after a reap', function () {
            this.player1.fightWith(this.scylla, this.umbra);
            this.player1.reap(this.brutodonAuxiliary);
            this.player1.fightWith(this.cornicenOctavia, this.dodger);
        });

        it('should allow another reap after an omni', function () {
            this.player1.reap(this.scylla);
            this.player1.useAction(this.saurianEgg, true);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            this.player1.reap(this.cornicenOctavia);
        });

        it('should allow another reap after an action', function () {
            this.player1.reap(this.scylla);
            this.player1.useAction(this.cornicenOctavia);
            this.player1.reap(this.brutodonAuxiliary);
        });

        it('should work against the opponent too', function () {
            this.player1.reap(this.scylla);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.reap(this.umbra);
            this.player2.clickCard(this.mackTheKnife);
            expect(this.player2).not.toHavePromptButton('Reap with this creature');
            this.player2.useAction(this.mackTheKnife);
            this.player2.clickCard(this.scylla);
            this.player2.reap(this.dodger);
        });
    });
});
