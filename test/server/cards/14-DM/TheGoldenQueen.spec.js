describe('The Golden Queen', function () {
    describe("The Golden Queen's persistent hand size effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['the-golden-queen', 'the-golden-queen2']
                },
                player2: {}
            });
        });

        it("should increase each player's max hand size by 1 while in play", function () {
            expect(this.player1.player.maxHandSize).toBe(6);
            expect(this.player2.player.maxHandSize).toBe(6);
            this.player1.play(this.theGoldenQueen);
            expect(this.player1.player.maxHandSize).toBe(7);
            expect(this.player2.player.maxHandSize).toBe(7);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("The Golden Queen's after-reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['the-golden-queen', 'the-golden-queen2', 'pen-pal']
                },
                player2: {
                    hand: ['troll']
                }
            });
            this.player1.play(this.theGoldenQueen);
            this.theGoldenQueen.ready();
        });

        it('should discard a random card from each player and gain 1A per non-Ekwidon discard', function () {
            this.player1.reap(this.theGoldenQueen);
            this.player1.clickPrompt('Me');
            expect(this.penPal.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let the controller choose opponent discards first', function () {
            this.player1.reap(this.theGoldenQueen);
            this.player1.clickPrompt('Opponent');
            expect(this.penPal.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not prompt for choice when orderForcedAbilities is disabled but still confirm', function () {
            this.player1.player.optionSettings.orderForcedAbilities = false;
            this.player1.reap(this.theGoldenQueen);
            this.player1.clickPrompt('Me');
            expect(this.penPal.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("The Golden Queen's after-reap ability with two non-Ekwidon discards", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['the-golden-queen', 'the-golden-queen2', 'mack-the-knife']
                },
                player2: {
                    hand: ['troll']
                }
            });
            this.player1.play(this.theGoldenQueen);
            this.theGoldenQueen.ready();
        });

        it('should gain 2A when both discarded cards are non-Ekwidon', function () {
            this.player1.reap(this.theGoldenQueen);
            this.player1.clickPrompt('Me');
            expect(this.mackTheKnife.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("The Golden Queen's after-reap ability with only Ekwidon discards", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['the-golden-queen', 'the-golden-queen2', 'pen-pal']
                },
                player2: {
                    hand: ['change-agent']
                }
            });
            this.player1.play(this.theGoldenQueen);
            this.theGoldenQueen.ready();
        });

        it('should not gain bonus amber when both discards are Ekwidon', function () {
            this.player1.reap(this.theGoldenQueen);
            this.player1.clickPrompt('Me');
            expect(this.penPal.location).toBe('discard');
            expect(this.changeAgent.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("The Golden Queen's after-fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['the-golden-queen', 'the-golden-queen2', 'mack-the-knife']
                },
                player2: {
                    hand: ['troll'],
                    inPlay: ['narp']
                }
            });
            this.player1.play(this.theGoldenQueen);
            this.theGoldenQueen.ready();
        });

        it('should discard a random card from each player on fight and gain 1A per non-Ekwidon', function () {
            this.player1.fightWith(this.theGoldenQueen, this.narp);
            this.player1.clickPrompt('Me');
            expect(this.mackTheKnife.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.narp.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
