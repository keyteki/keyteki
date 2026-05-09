describe('Storm Surge', function () {
    describe("Storm Surge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    hand: ['storm-surge'],
                    inPlay: ['bubbles', 'hookmaster']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll', 'krump', 'gub'],
                    hand: ['ganger-chieftain']
                }
            });

            this.player1.play(this.stormSurge);
        });

        it('should allow owner to ready cards on their turn', function () {
            this.player1.reap(this.bubbles);
            this.player1.reap(this.hookmaster);
            this.player1.endTurn();

            expect(this.bubbles.exhausted).toBe(false);
            expect(this.hookmaster.exhausted).toBe(false);
        });

        describe("during opponent's turn", function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('brobnar');
            });

            it('should not prevent readying out of ready phase', function () {
                this.player2.reap(this.troll);
                this.player2.reap(this.krump);
                this.player2.play(this.gangerChieftain, true);
                this.player2.clickCard(this.gangerChieftain);
                this.player2.clickCard(this.troll);
                this.player2.clickCard(this.hookmaster);
                expect(this.player2.amber).toBe(4);
                expect(this.hookmaster.location).toBe('discard');
                this.player2.endTurn();

                expect(this.troll.exhausted).toBe(true);
                expect(this.krump.exhausted).toBe(true);
                expect(this.gangerChieftain.exhausted).toBe(true);
                expect(this.gub.exhausted).toBe(false);
            });

            it('should prevent readying their cards', function () {
                this.player2.reap(this.troll);
                this.player2.reap(this.krump);
                expect(this.player2.amber).toBe(4);
                this.player2.endTurn();

                expect(this.troll.exhausted).toBe(true);
                expect(this.krump.exhausted).toBe(true);
                expect(this.gub.exhausted).toBe(false);
            });

            describe('and should last for one turn only', function () {
                beforeEach(function () {
                    this.player2.endTurn();
                    this.player1.clickPrompt('unfathomable');
                    this.player1.endTurn();
                    this.player2.clickPrompt('dis');
                });

                it('should prevent readying their cards', function () {
                    this.player2.reap(this.gub);
                    expect(this.player2.amber).toBe(3);
                    this.player2.endTurn();

                    expect(this.troll.exhausted).toBe(false);
                    expect(this.krump.exhausted).toBe(false);
                    expect(this.gub.exhausted).toBe(false);
                });
            });
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'unfathomable',
                    hand: ['storm-surge'],
                    inPlay: ['tachyon-manifold']
                },
                player2: {
                    amber: 0,
                    inPlay: ['ember-imp'],
                    hand: []
                }
            });
            this.player1.makeMaverick(this.tachyonManifold, 'unfathomable');
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.play(this.stormSurge);
            this.player1.endTurn();
            this.player1.clickPrompt('unfathomable');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.reap(this.emberImp);
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            expect(this.emberImp.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
