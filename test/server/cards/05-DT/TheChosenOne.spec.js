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
                    inPlay: [
                        'batdrone',
                        'dextre',
                        'lollop-the-titanic',
                        'daughter',
                        'groggins',
                        'hologrammophone'
                    ],
                    hand: ['helper-bot', 'ganger-chieftain']
                }
            });
        });

        describe('when controller ends turn', function () {
            beforeEach(function () {
                this.player1.reap(this.troll);
                this.player1.reap(this.valdr);
                this.player1.endTurn();
            });

            it('should not deal 3 damages to TCO due to exhausted creatures', function () {
                expect(this.theChosenOne.damage).toBe(0);
            });

            it('should ready creatures', function () {
                expect(this.troll.exhausted).toBe(false);
                expect(this.valdr.exhausted).toBe(false);
            });

            describe('and opponent passes their ready phase', function () {
                beforeEach(function () {
                    this.player2.clickPrompt('logos');
                    this.player2.reap(this.batdrone);
                    this.player2.reap(this.dextre);
                    this.player2.reap(this.daughter);
                    this.player2.useAction(this.hologrammophone);
                    this.player2.clickCard(this.daughter);
                    this.player2.endTurn();
                });

                it('should deal 3 damages to TCO due to exhausted creatures', function () {
                    expect(this.theChosenOne.damage).toBe(3);
                });

                it('should not ready creatures', function () {
                    expect(this.groggins.exhausted).toBe(false);
                    expect(this.lollopTheTitanic.exhausted).toBe(false);
                    expect(this.batdrone.exhausted).toBe(true);
                    expect(this.dextre.exhausted).toBe(true);
                    expect(this.daughter.exhausted).toBe(true);
                    expect(this.hologrammophone.exhausted).toBe(false);
                });
            });

            describe('should not affect readying out of ready phase', function () {
                beforeEach(function () {
                    this.player2.clickPrompt('logos');
                    this.player2.reap(this.batdrone);
                    this.player2.play(this.helperBot);
                    this.player2.play(this.gangerChieftain, true);
                    expect(this.player2).toBeAbleToSelect(this.gangerChieftain);
                    this.player2.clickCard(this.gangerChieftain);
                });

                it('should be able to ready out of ready phase', function () {
                    this.player2.clickCard(this.batdrone);
                    expect(this.player2).toBeAbleToSelect(this.troll);
                    expect(this.player2).toBeAbleToSelect(this.valdr);
                    this.player2.clickCard(this.troll);
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

                it('should ready creatures', function () {
                    expect(this.lollopTheTitanic.exhausted).toBe(false);
                    expect(this.groggins.exhausted).toBe(false);
                    expect(this.batdrone.exhausted).toBe(false);
                    expect(this.dextre.exhausted).toBe(false);
                    expect(this.daughter.exhausted).toBe(false);
                });
            });

            describe('when TCO is destroyed during ready phase', function () {
                beforeEach(function () {
                    this.theChosenOne.damage = 8;
                    this.player2.clickPrompt('brobnar');
                    this.player2.reap(this.lollopTheTitanic);
                    this.player2.reap(this.groggins);
                    this.player2.endTurn();
                });

                it('should still not ready creatures', function () {
                    expect(this.theChosenOne.location).toBe('discard');
                    expect(this.lollopTheTitanic.exhausted).toBe(true);
                    expect(this.groggins.exhausted).toBe(true);
                    expect(this.batdrone.exhausted).toBe(false);
                    expect(this.dextre.exhausted).toBe(false);
                    expect(this.daughter.exhausted).toBe(false);
                    this.player1.clickPrompt('brobnar');
                    this.player1.endTurn();
                });
            });
        });
    });
});
