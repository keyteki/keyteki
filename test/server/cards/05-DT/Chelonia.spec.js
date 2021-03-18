describe('Chelonia', function () {
    describe('when the tide is neutral', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    hand: ['rustgnawer', 'tantadlin', 'dew-faerie', 'duskwitch', 'chelonia']
                },
                player2: {
                    amber: 2,
                    inPlay: ['brain-eater', 'dextre', 'daughter'],
                    hand: ['mother']
                }
            });
        });

        it('should not gain amber when playing another creature', function () {
            this.player1.play(this.chelonia);
            expect(this.player1.amber).toBe(1);
            this.player1.play(this.tantadlin);
            expect(this.player1.amber).toBe(1);
            this.player1.play(this.rustgnawer);
            expect(this.player1.amber).toBe(1);
            this.player1.play(this.dewFaerie);
            expect(this.player1.amber).toBe(1);
            this.player1.play(this.duskwitch);
            expect(this.player1.amber).toBe(1);
        });

        describe('when the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('should not gain amber when playing another creature', function () {
                this.player1.play(this.chelonia);
                expect(this.player1.amber).toBe(1);
                this.player1.play(this.tantadlin);
                expect(this.player1.amber).toBe(1);
                this.player1.play(this.rustgnawer);
                expect(this.player1.amber).toBe(1);
                this.player1.play(this.dewFaerie);
                expect(this.player1.amber).toBe(1);
                this.player1.play(this.duskwitch);
                expect(this.player1.amber).toBe(1);
            });

            describe("during opponent's turn", function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player2.clickPrompt('logos');
                });

                it('should not gain amber when playing another creature', function () {
                    this.player2.play(this.mother);
                    expect(this.player2.amber).toBe(2);
                });
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should not gain amber when playing another creature', function () {
                this.player1.play(this.chelonia);
                expect(this.player1.amber).toBe(1);
                this.player1.play(this.tantadlin);
                expect(this.player1.amber).toBe(2);
                this.player1.play(this.rustgnawer);
                expect(this.player1.amber).toBe(3);
                this.player1.play(this.dewFaerie);
                expect(this.player1.amber).toBe(4);
                this.player1.play(this.duskwitch);
                expect(this.player1.amber).toBe(5);
            });

            describe("during opponent's turn", function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player2.clickPrompt('logos');
                });

                it('should not gain amber when playing another creature', function () {
                    this.player2.play(this.mother);
                    expect(this.player2.amber).toBe(2);
                });
            });
        });
    });
});
