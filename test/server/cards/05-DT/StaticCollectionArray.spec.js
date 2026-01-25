describe('StaticCollectionArray', function () {
    describe("StaticCollectionArray's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'untamed',
                    inPlay: [
                        'ancient-bear',
                        'static-collection-array',
                        'chonkers',
                        'cephaloist',
                        'keyfrog'
                    ],
                    hand: ['key-charge']
                },
                player2: {
                    amber: 2,
                    inPlay: ['bad-penny', 'troll', 'groggins']
                }
            });

            this.player1.reap(this.ancientBear);
            this.player1.reap(this.chonkers);
            this.player1.reap(this.cephaloist);
            expect(this.player1.amber).toBe(8);
        });

        describe('when the tide is neutral', function () {
            it('should forge a key paying 6A + 1', function () {
                this.player1.play(this.keyCharge);
                this.player1.clickPrompt('Yes');
                this.player1.forgeKey('Red');
                expect(this.player1.amber).toBe(1);
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should forge a key paying 5A + 1', function () {
                this.player1.play(this.keyCharge);
                this.player1.clickPrompt('Yes');
                this.player1.forgeKey('Red');
                expect(this.player1.amber).toBe(2);
            });

            it("should forge a key paying 5A during opponent's turn", function () {
                this.player1.endTurn();
                this.player2.clickPrompt('brobnar');
                this.player2.fightWith(this.troll, this.keyfrog);
                this.player2.forgeKey('Red');
                expect(this.player1.amber).toBe(3);
            });

            describe('should not affect opponent', function () {
                beforeEach(function () {
                    this.player2.amber = 6;
                    this.player1.endTurn();
                    this.player2.forgeKey('Red');
                });

                it('should forge a key paying 6A', function () {
                    expect(this.player2.amber).toBe(0);
                });
            });
        });

        describe('when the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('should forge a key paying 7A + 1', function () {
                this.player1.play(this.keyCharge);
                this.player1.clickPrompt('Yes');
                this.player1.forgeKey('Red');
                expect(this.player1.amber).toBe(0);
            });

            it("should forge a key paying 7A during opponent's turn", function () {
                this.player1.endTurn();
                this.player2.clickPrompt('brobnar');
                this.player2.fightWith(this.troll, this.keyfrog);
                this.player2.forgeKey('Red');
                expect(this.player1.amber).toBe(1);
            });

            describe('should not affect opponent', function () {
                beforeEach(function () {
                    this.player2.amber = 6;
                    this.player1.endTurn();
                    this.player2.forgeKey('Red');
                });

                it('should forge a key paying 6A', function () {
                    expect(this.player2.amber).toBe(0);
                });
            });
        });
    });
});
