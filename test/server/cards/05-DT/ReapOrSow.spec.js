describe('Reap Or Sow', function () {
    describe("Reap Or Sow's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['bring-low', 'lord-golgotha', 'reap-or-sow'],
                    inPlay: ['dust-pixie', 'sequis', 'giant-sloth', 'awakened-titan']
                },
                player2: {
                    inPlay: ['troll', 'snufflegator'],
                    hand: ['inky-gloom'],
                    amber: 1
                }
            });
        });

        it('should prompt with 2 choices', function () {
            this.player1.play(this.reapOrSow);
            expect(this.player1).toHavePromptButton('Ready and reap');
            expect(this.player1).toHavePromptButton('Add power counters');
        });

        it('should allow any friendly creature to ready and reap', function () {
            this.player1.reap(this.dustPixie);
            this.player1.play(this.reapOrSow);
            this.player1.clickPrompt('Ready and reap');
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.giantSloth);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.dustPixie);
            expect(this.player1.amber).toBe(2);
        });

        it('should allow any friendly creature to be targeted, even if it cannot ready', function () {
            this.awakenedTitan.exhausted = true;
            this.player1.play(this.reapOrSow);
            this.player1.clickPrompt('Ready and reap');
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.giantSloth);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).toBeAbleToSelect(this.awakenedTitan);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.awakenedTitan);
            expect(this.player1.amber).toBe(0);
            expect(this.awakenedTitan.exhausted).toBe(true);
        });

        it('should allow any friendly creature to ready and reap, even if it cannot be used', function () {
            this.player1.play(this.reapOrSow);
            this.player1.clickPrompt('Ready and reap');
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.giantSloth);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.giantSloth);
            expect(this.player1.amber).toBe(0);
            expect(this.giantSloth.exhausted).toBe(false);
        });

        it('should allow any friendly creature to ready and remove its stun', function () {
            this.player1.reap(this.dustPixie);
            this.dustPixie.stun();
            this.player1.play(this.reapOrSow);
            this.player1.clickPrompt('Ready and reap');
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).toBeAbleToSelect(this.giantSloth);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.stunned).toBe(false);
            expect(this.dustPixie.exhausted).toBe(true);
        });

        it('should not remove stun of a creature that cannot be used', function () {
            this.giantSloth.stun();
            this.player1.play(this.reapOrSow);
            this.player1.clickPrompt('Ready and reap');
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).toBeAbleToSelect(this.giantSloth);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.giantSloth);
            expect(this.giantSloth.stunned).toBe(true);
            expect(this.giantSloth.exhausted).toBe(false);
        });

        it('should allow giving out 3 power counters', function () {
            this.player1.play(this.reapOrSow);
            this.player1.clickPrompt('Add power counters');
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.troll);
            expect(this.dustPixie.tokens.power).toBe(2);
            expect(this.troll.tokens.power).toBe(1);
        });

        describe('and inky gloom is played', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.play(this.inkyGloom);
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');
            });

            it('should allow any friendly creature to ready and reap without effect', function () {
                this.player1.play(this.reapOrSow);
                this.player1.clickPrompt('Ready and reap');
                expect(this.player1).toBeAbleToSelect(this.dustPixie);
                expect(this.player1).toBeAbleToSelect(this.giantSloth);
                expect(this.player1).toBeAbleToSelect(this.sequis);
                expect(this.player1).not.toBeAbleToSelect(this.troll);
                this.player1.clickCard(this.dustPixie);
                expect(this.player1.amber).toBe(0);
                this.player1.endTurn();
            });

            it('should allow any friendly creature to ready and remove its stun', function () {
                this.dustPixie.stun();
                this.player1.play(this.reapOrSow);
                this.player1.clickPrompt('Ready and reap');
                expect(this.player1).toBeAbleToSelect(this.dustPixie);
                expect(this.player1).toBeAbleToSelect(this.sequis);
                expect(this.player1).toBeAbleToSelect(this.giantSloth);
                expect(this.player1).not.toBeAbleToSelect(this.troll);
                this.player1.clickCard(this.dustPixie);
                expect(this.dustPixie.stunned).toBe(false);
                expect(this.dustPixie.exhausted).toBe(true);
                this.player1.endTurn();
            });
        });
    });
});
