describe('Edict of Nerotaurus', function () {
    describe("Edict of Nerotaurus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'saurian',
                    token: 'trader',
                    inPlay: [
                        'edict-of-nerotaurus',
                        'scylla',
                        'brutodon-auxiliary',
                        'cornicen-octavia',
                        'saurian-egg',
                        'antiquities-dealer',
                        'trader:faust-the-great',
                        'trader:crystal-surge',
                        'shrewd-investor',
                        'monument-to-faust'
                    ],
                    hand: ['ancient-power']
                },
                player2: {
                    amber: 1,
                    inPlay: ['umbra', 'dodger', 'mack-the-knife']
                }
            });

            this.trader1 = this.player1.inPlay[6];
            this.trader2 = this.player1.inPlay[7];
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

        it('should not allow two reaps in a row, even after playing card', function () {
            this.player1.reap(this.scylla);
            this.player1.play(this.ancientPower);
            this.player1.clickCard(this.brutodonAuxiliary);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
        });

        it('should not allow two fights in a row, even after playing card', function () {
            this.player1.fightWith(this.scylla, this.umbra);
            this.player1.play(this.ancientPower);
            this.player1.clickCard(this.brutodonAuxiliary);
            expect(this.player1).not.toHavePromptButton('Fight with this creature');
        });

        it('should not allow two reaps in a row, even after using an artifact', function () {
            this.player1.reap(this.scylla);
            this.player1.useAction(this.monumentToFaust);
            this.player1.clickCard(this.brutodonAuxiliary);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
        });

        it('should not allow two fights in a row, even after using an artifact', function () {
            this.player1.fightWith(this.scylla, this.umbra);
            this.player1.useAction(this.monumentToFaust);
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

        it('should allow another reap after a token action that destroys it, and its versus is a creature', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.player1.reap(this.antiquitiesDealer);
            this.player1.useAction(this.trader1);
            expect(this.trader1.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(0);
            this.player1.reap(this.shrewdInvestor);
            expect(this.player1.amber).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow another reap after a token action that destroys it, and its versus is an action', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.player1.reap(this.antiquitiesDealer);
            this.player1.useAction(this.trader2);
            expect(this.trader2.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(0);
            this.player1.reap(this.shrewdInvestor);
            expect(this.player1.amber).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
