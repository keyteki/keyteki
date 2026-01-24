describe('Primal Relic', function () {
    describe("Primal Relic's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['primal-relic'],
                    inPlay: ['flaxia', 'dust-pixie']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('it should place 4AE on it when played', function () {
            this.player1.play(this.primalRelic);
            expect(this.primalRelic.tokens.amber).toBe(4);
        });

        it('it should prompt to give 3 power tokens on play on any creature', function () {
            this.player1.play(this.primalRelic);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);

            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.flaxia);
            this.player1.clickPrompt('Done');

            expect(this.dustPixie.powerCounters).toBe(1);
            expect(this.krump.powerCounters).toBe(1);
            expect(this.flaxia.powerCounters).toBe(1);

            this.player1.endTurn();
        });

        describe('when in play', function () {
            beforeEach(function () {
                this.player1.play(this.primalRelic);
                this.player1.clickCard(this.dustPixie);
                this.player1.clickCard(this.krump);
                this.player1.clickCard(this.flaxia);
                this.player1.clickPrompt('Done');
            });

            it('should give all of the aember on it if either player starts a turn with > 20 power creatures in play', function () {
                for (let i = 0; i < 20; i++) {
                    this.krump.addToken('power');
                }

                this.player1.endTurn();
                expect(this.primalRelic.tokens.amber).toBeUndefined();
                expect(this.player1.amber).toBe(2); // started with 1, gained one from primal relic
                expect(this.player2.amber).toBe(5); // started with 1, gained 4
            });

            it('should give all of the aember on it if either player starts a turn with EXACTLY 20 power creatures in play', function () {
                // gub(1) + krump(7) = 8 - need 12 to get to 20
                for (let i = 0; i < 12; i++) {
                    this.krump.addToken('power');
                }

                this.player1.endTurn();
                expect(this.primalRelic.tokens.amber).toBeUndefined();
                expect(this.player1.amber).toBe(2); // started with 1, gained one from primal relic
                expect(this.player2.amber).toBe(5); // started with 1, gained 4
            });

            it('give NONE aember on it if either player starts a turn with < 20 power creatures in play', function () {
                this.player1.endTurn();
                this.player2.clickPrompt('untamed');
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');

                // no ameber should have been gained
                // since both players have less than 20 power in creatures
                expect(this.player1.amber).toBe(2); // started with 1, gained one from primal relic
                expect(this.player2.amber).toBe(1);
            });

            it('should continue to move amber each turn when there is still amber on the artifact', function () {
                for (let i = 0; i < 20; i++) {
                    this.krump.addToken('power');
                }

                this.player1.endTurn();
                expect(this.primalRelic.tokens.amber).toBeUndefined();
                expect(this.player1.amber).toBe(2); // started with 1, gained one from primal relic
                expect(this.player2.amber).toBe(5); // started with 1, gained 4

                this.player2.clickPrompt('untamed');
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');
                this.player1.endTurn();

                // should not gain more when there is none to gain
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(5);

                this.primalRelic.addToken('amber');

                this.player2.clickPrompt('untamed');
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');
                this.player1.endTurn();

                // player 2 should gain 1 more since there was one more gain
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(6);
            });
        });
    });
});
