describe('Self-Bolstering Automata', function () {
    describe('destroyed ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['self-bolstering-automata', 'pip-pip'],
                    hand: ['bouncing-deathquark', 'positron-bolt']
                },
                player2: {
                    amber: 1,
                    inPlay: ['nexus', 'troll', 'dodger']
                }
            });
        });

        describe('when other creatures are in play', function () {
            describe('and automata is destroyed', function () {
                beforeEach(function () {
                    this.player1.fightWith(this.selfBolsteringAutomata, this.troll);
                    this.player1.clickPrompt('right');
                });

                it('should fully heal automata, not destroy it, exhaust it and move it to the right flank', function () {
                    expect(this.selfBolsteringAutomata.tokens.damage).toBe(undefined);
                    expect(this.selfBolsteringAutomata.location).toBe('play area');
                    expect(this.selfBolsteringAutomata.exhausted).toBe(true);
                    expect(this.player1.player.cardsInPlay[1]).toBe(this.selfBolsteringAutomata);
                });

                it('should not gain 2 +1 power counters, since it was exhausted by fighting', function () {
                    expect(this.selfBolsteringAutomata.tokens.power).toBeUndefined();
                });
            });
        });

        describe('when no other creatures are in play', function () {
            describe('and automata is destroyed', function () {
                beforeEach(function () {
                    this.player1.moveCard(this.pipPip, 'discard');
                    this.player1.fightWith(this.selfBolsteringAutomata, this.troll);
                });

                it('should not stop automata from being destroyed', function () {
                    expect(this.selfBolsteringAutomata.location).toBe('discard');
                });
            });
        });

        describe('when destroyed with damage', function () {
            beforeEach(function () {
                this.pipPip.tokens.ward = 1;
                this.player1.play(this.positronBolt);
                this.player1.clickCard(this.selfBolsteringAutomata);
                this.player1.clickCard(this.pipPip);
            });

            it('should fully heal automata, not destroy it, exhaust it and move it to the right flank and get 2 +1 power counters', function () {
                expect(this.player1).toHavePrompt('Self-Bolstering Automata');
                this.player1.clickPrompt('right');
                expect(this.selfBolsteringAutomata.tokens.damage).toBe(undefined);
                expect(this.selfBolsteringAutomata.location).toBe('play area');
                expect(this.selfBolsteringAutomata.exhausted).toBe(true);
                expect(this.player1.player.cardsInPlay[1]).toBe(this.selfBolsteringAutomata);
                expect(this.selfBolsteringAutomata.tokens.power).toBe(2);
            });
        });

        describe('when destroyed without damage', function () {
            beforeEach(function () {
                this.player1.play(this.bouncingDeathquark);
                this.player1.clickCard(this.troll);
                this.player1.clickCard(this.selfBolsteringAutomata);
            });

            it('should fully heal automata, not destroy it, exhaust it and move it to the right flank', function () {
                expect(this.player1).toHavePrompt('Self-Bolstering Automata');
                this.player1.clickPrompt('right');
                expect(this.selfBolsteringAutomata.tokens.damage).toBe(undefined);
                expect(this.selfBolsteringAutomata.location).toBe('play area');
                expect(this.selfBolsteringAutomata.exhausted).toBe(true);
                expect(this.player1.player.cardsInPlay[1]).toBe(this.selfBolsteringAutomata);
                expect(this.selfBolsteringAutomata.hasToken('power')).toBe(false);
            });
        });
    });
});
