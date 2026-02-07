describe('Æmberspine Mongrel', function () {
    describe("Æmberspine Mongrel's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['æmberspine-mongrel', 'mighty-tiger', 'ancient-bear']
                },
                player2: {
                    inPlay: ['collector-worm', 'mindwarper'],
                    hand: ['hypnobeam']
                }
            });
        });

        it('when own creatures reap, should not gain gamber', function () {
            this.player1.reap(this.æmberspineMongrel);
            this.player1.reap(this.mightyTiger);
            this.player1.reap(this.ancientBear);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(0);
        });

        describe("during opponent's turn", function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('mars');
            });

            it("when opponent's creatures reap, should gain gamber", function () {
                this.player2.reap(this.collectorWorm);
                this.player2.reap(this.mindwarper);
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(2);
            });

            describe('if opponent take control of creature', function () {
                beforeEach(function () {
                    this.player2.play(this.hypnobeam);
                    this.player2.clickCard(this.æmberspineMongrel);
                    this.player2.clickPrompt('Left');
                });

                it('when creatures reap, should not given amber to owner', function () {
                    this.player2.reap(this.collectorWorm);
                    this.player2.reap(this.mindwarper);
                    expect(this.player1.amber).toBe(0);
                    expect(this.player2.amber).toBe(2);
                });

                describe("during owner's turn", function () {
                    beforeEach(function () {
                        this.player2.endTurn();
                        this.player1.clickPrompt('untamed');
                    });

                    it('when creatures reap, should given amber to controller', function () {
                        this.player1.reap(this.mightyTiger);
                        this.player1.reap(this.ancientBear);
                        expect(this.player1.amber).toBe(2);
                        expect(this.player2.amber).toBe(2);
                    });
                });
            });
        });
    });
});
