describe('The Chosen One', function () {
    describe('ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'brobnar',
                    inPlay: ['troll', 'valdr', 'the-chosen-one']
                },
                player2: {
                    amber: 1,
                    inPlay: ['batdrone', 'dextre', 'lollop-the-titanic', 'daughter', 'groggins']
                }
            });
        });

        describe('when controller ends turn', function () {
            beforeEach(function () {
                this.player1.reap(this.troll);
                this.player1.reap(this.valdr);
                this.player1.endTurn();
            });

            it('should not 3 damages to TCO due to exhausted creatures', function () {
                expect(this.theChosenOne.tokens.damage).toBeUndefined();
            });

            it('should ready creatures', function () {
                expect(this.troll.exhausted).toBe(false);
                expect(this.valdr.exhausted).toBe(false);
            });

            describe('when opponent is about to ready cards', function () {
                beforeEach(function () {
                    this.player2.clickPrompt('logos');
                    this.player2.reap(this.batdrone);
                    this.player2.reap(this.dextre);
                    this.player2.reap(this.daughter);
                    this.player2.endTurn();
                });

                it('should deal 3 damages to TCO due to exhausted creatures', function () {
                    expect(this.theChosenOne.tokens.damage).toBe(3);
                });

                it('should not ready cards', function () {
                    expect(this.groggins.exhausted).toBe(false);
                    expect(this.lollopTheTitanic.exhausted).toBe(false);
                    expect(this.batdrone.exhausted).toBe(true);
                    expect(this.dextre.exhausted).toBe(true);
                    expect(this.daughter.exhausted).toBe(true);
                });
            });

            describe('when TCO is destroyed', function () {
                beforeEach(function () {
                    this.player2.clickPrompt('brobnar');
                    this.player2.fightWith(this.lollopTheTitanic, this.theChosenOne);
                    expect(this.theChosenOne.location).toBe('discard');
                    this.player2.reap(this.groggins);
                    this.player2.endTurn();
                });

                it('should ready cards', function () {
                    expect(this.lollopTheTitanic.exhausted).toBe(false);
                    expect(this.groggins.exhausted).toBe(false);
                    expect(this.batdrone.exhausted).toBe(false);
                    expect(this.dextre.exhausted).toBe(false);
                    expect(this.daughter.exhausted).toBe(false);
                });
            });
        });
    });
});
