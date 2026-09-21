describe('Destroyed replacement effects', function () {
    describe('"After a creature is destroyed" effects do not trigger when the destruction is replaced', function () {
        describe('"each time" effects are ignored', function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'unfathomable',
                        amber: 0,
                        inPlay: ['soul-snatcher'],
                        hand: ['tsunami']
                    },
                    player2: {
                        amber: 0,
                        inPlay: ['toad', 'self-bolstering-automata']
                    }
                });
            });

            it('should not award amber for replaced destroyed effects', function () {
                this.player1.play(this.tsunami);
                this.player1.clickPrompt('Left');
                expect(this.player2.amber).toEqual(1);
                expect(this.selfBolsteringAutomata.powerCounters).toBe(2);
                expect(this.selfBolsteringAutomata.location).toBe('play area');
            });
        });

        describe('"after" effects are ignored', function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'untamed',
                        inPlay: ['chonkers']
                    },
                    player2: {
                        inPlay: ['self-bolstering-automata', 'toad']
                    }
                });
            });

            it('should not trigger when the destroyed event is replaced', function () {
                this.chonkers.powerCounters = 3;
                this.chonkers.addToken('ward');
                this.scenarioBreak();
                this.player1.fightWith(this.chonkers, this.selfBolsteringAutomata);
                this.player1.clickPrompt('Left');
                expect(this.chonkers.powerCounters).toBe(3);
                expect(this.selfBolsteringAutomata.powerCounters).toBe(2);
            });
        });
    });

    describe('Replacement does not trigger when a creature leaves play during the destroyed window', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['tunk'],
                    hand: ['the-body-snatchers']
                },
                player2: {
                    amber: 0,
                    inPlay: ['bad-penny']
                }
            });
        });

        it('should not steal Bad Penny when it returns to hand via its own Destroyed: ability', function () {
            this.player1.play(this.theBodySnatchers);
            this.player1.fightWith(this.tunk, this.badPenny);
            this.player1.clickPrompt('The Body Snatchers');
            expect(this.badPenny.location).toBe('hand');
            expect(this.badPenny.controller).toBe(this.player2.player);
        });
    });

    describe('Replacement effects happen after all other Destroyed: abilities resolve', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    amber: 1,
                    inPlay: ['tunk'],
                    hand: ['the-body-snatchers']
                },
                player2: {
                    amber: 1,
                    inPlay: ['fallguy']
                }
            });
        });

        it("should steal amber from Fallguy's Destroyed: ability before the replacement fires", function () {
            this.player1.play(this.theBodySnatchers);
            this.player1.fightWith(this.tunk, this.fallguy);
            this.player1.clickPrompt('The Body Snatchers');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            expect(this.fallguy.location).toBe('play area');
            expect(this.fallguy.controller).toBe(this.player1.player);
        });
    });
});
