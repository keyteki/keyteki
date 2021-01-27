describe('Kiri Giltspine', function () {
    describe("Kiri Giltspine's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['kiri-giltspine', 'kaupe', 'hookmaster', 'lamindra']
                },
                player2: {
                    inPlay: ['tunk', 'mindwarper'],
                    hand: ['hypnobeam', 'squawker']
                }
            });
        });

        it('when own creatures reap, at the end of turn, should ready', function () {
            this.player1.reap(this.kiriGiltspine);
            this.player1.reap(this.kaupe);
            this.player1.reap(this.hookmaster);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(0);
            this.player1.endTurn();

            expect(this.kiriGiltspine.exhausted).toBe(false);
            expect(this.kaupe.exhausted).toBe(false);
            expect(this.hookmaster.exhausted).toBe(false);
        });

        describe("during opponent's turn", function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('mars');
            });

            it('creatures that reap should not be ready at end of turn', function () {
                this.player2.reap(this.tunk);
                this.player2.fightWith(this.mindwarper, this.lamindra);
                expect(this.player1.amber).toBe(0);
                expect(this.player2.amber).toBe(1);
                this.player2.endTurn();

                expect(this.tunk.exhausted).toBe(true);
                expect(this.mindwarper.exhausted).toBe(false);
            });

            it('creatures that reap can be ready during main phase', function () {
                this.player2.reap(this.tunk);
                this.player2.fightWith(this.mindwarper, this.lamindra);
                expect(this.player1.amber).toBe(0);
                expect(this.player2.amber).toBe(1);
                this.player2.play(this.squawker);
                this.player2.clickCard(this.tunk);

                expect(this.tunk.exhausted).toBe(false);
            });

            it('creatures that reap and fight should not be readied', function () {
                this.player2.reap(this.tunk);
                this.player2.fightWith(this.mindwarper, this.lamindra);
                this.player2.play(this.squawker);
                this.player2.clickCard(this.tunk);
                this.player2.fightWith(this.tunk, this.lamindra);

                this.player2.endTurn();

                expect(this.tunk.exhausted).toBe(true);
                expect(this.mindwarper.exhausted).toBe(false);
            });

            it('should last for one round only', function () {
                this.player2.reap(this.tunk);
                this.player2.fightWith(this.mindwarper, this.lamindra);
                expect(this.player1.amber).toBe(0);
                expect(this.player2.amber).toBe(1);
                this.player2.endTurn();

                this.player1.clickPrompt('unfathomable');
                this.player1.endTurn();
                this.player2.clickPrompt('mars');
                this.player2.endTurn();

                expect(this.tunk.exhausted).toBe(false);
                expect(this.mindwarper.exhausted).toBe(false);
            });

            describe('if opponent take control of creature', function () {
                beforeEach(function () {
                    this.player2.play(this.hypnobeam);
                    this.player2.clickCard(this.kiriGiltspine);
                    this.player2.clickPrompt('Left');
                });

                it('creatures that reap should not be ready at end of turn"', function () {
                    this.player2.reap(this.tunk);
                    this.player2.reap(this.mindwarper);
                    expect(this.player1.amber).toBe(0);
                    expect(this.player2.amber).toBe(2);

                    this.player2.endTurn();

                    expect(this.tunk.exhausted).toBe(false);
                    expect(this.mindwarper.exhausted).toBe(false);
                });

                describe("during owner's turn", function () {
                    beforeEach(function () {
                        this.player2.endTurn();
                        this.player1.clickPrompt('unfathomable');
                    });

                    it('when creatures reap, should not ready after end of turn', function () {
                        this.player1.reap(this.hookmaster);
                        this.player1.reap(this.kaupe);

                        this.player1.endTurn();

                        expect(this.hookmaster.exhausted).toBe(true);
                        expect(this.kaupe.exhausted).toBe(true);
                    });
                });
            });
        });
    });
});
