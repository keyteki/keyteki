describe('EvenSwap', function () {
    describe("Even Swap's ability with 2 creatures on each side", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['even-swap'],
                    inPlay: ['urchin', 'snufflegator']
                },
                player2: {
                    inPlay: ['flaxia', 'exeldon-yash']
                }
            });
        });

        it('swaps two friendly and two enemy creatures', function () {
            this.player1.play(this.evenSwap);
            // First give: only friendly creatures should be selectable.
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.snufflegator);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.exeldonYash);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Left');
            // Second give: only the remaining friendly creature is selectable.
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.snufflegator);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.exeldonYash);
            this.player1.clickCard(this.snufflegator);
            this.player1.clickPrompt('Left');
            // Take phase: every creature is now controlled by the opponent
            // (both originals plus the two just given), all selectable.
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.exeldonYash);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.snufflegator);
            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.exeldonYash);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Left');
            expect(this.urchin.controller).toBe(this.player2.player);
            expect(this.snufflegator.controller).toBe(this.player2.player);
            expect(this.flaxia.controller).toBe(this.player1.player);
            expect(this.exeldonYash.controller).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Even Swap's ability when the player has only 1 creature", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['even-swap'],
                    inPlay: ['urchin']
                },
                player2: {
                    inPlay: ['flaxia', 'exeldon-yash']
                }
            });
        });

        it('gives the only friendly creature but takes none', function () {
            this.player1.play(this.evenSwap);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Left');
            expect(this.urchin.controller).toBe(this.player2.player);
            expect(this.flaxia.controller).toBe(this.player2.player);
            expect(this.exeldonYash.controller).toBe(this.player2.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Even Swap's ability when the player has 0 creatures", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['even-swap'],
                    inPlay: []
                },
                player2: {
                    inPlay: ['flaxia', 'exeldon-yash']
                }
            });
        });

        it('can be played and resolves with no swaps', function () {
            this.player1.play(this.evenSwap);
            expect(this.flaxia.controller).toBe(this.player2.player);
            expect(this.exeldonYash.controller).toBe(this.player2.player);
            expect(this.evenSwap.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Even Swap's ability when the opponent has only 1 creature", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['even-swap'],
                    inPlay: ['urchin', 'snufflegator']
                },
                player2: {
                    inPlay: ['flaxia']
                }
            });
        });

        it('gives 2 friendly and takes the 1 enemy plus 1 of the given creatures', function () {
            this.player1.play(this.evenSwap);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.snufflegator);
            this.player1.clickPrompt('Left');
            // Now player2 controls flaxia, urchin, snufflegator. Take 2 back.
            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Left');
            expect(this.flaxia.controller).toBe(this.player1.player);
            expect(this.urchin.controller).toBe(this.player1.player);
            expect(this.snufflegator.controller).toBe(this.player2.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Even Swap's ability when the opponent has 0 creatures", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['even-swap'],
                    inPlay: ['urchin', 'snufflegator']
                },
                player2: {
                    inPlay: []
                }
            });
        });

        it('gives 2 friendly creatures and takes both back', function () {
            this.player1.play(this.evenSwap);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.snufflegator);
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.snufflegator);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Left');
            expect(this.urchin.controller).toBe(this.player1.player);
            expect(this.snufflegator.controller).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Even Swap's ability with Tribune Pompitus", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['even-swap'],
                    inPlay: ['tribune-pompitus', 'exeldon-yash', 'conrad-fisique']
                },
                player2: {
                    inPlay: []
                }
            });
            // Each given creature has 1 amber and enough damage that without
            // Tribune Pompitus's +2 power per A, it would be destroyed.
            this.exeldonYash.amber = 1;
            this.exeldonYash.damage = 4;
            this.conradFisique.amber = 1;
            this.conradFisique.damage = 3;
        });

        it('gives 2 creatures who die on the opponent side and player1 gains their amber', function () {
            // Even Swap has a printed +1 amber bonus, plus 1 amber from each
            // destroyed given creature = +3 total.
            const startingAmber = this.player1.amber;
            this.player1.play(this.evenSwap);
            this.player1.clickCard(this.exeldonYash);
            this.player1.clickCard(this.conradFisique);
            expect(this.exeldonYash.location).toBe('discard');
            expect(this.conradFisique.location).toBe('discard');
            expect(this.tribunePompitus.controller).toBe(this.player1.player);
            expect(this.player1.amber).toBe(startingAmber + 3);
            this.player1.clickPrompt('Done');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Even Swap's ability when giving the first creature kills the second", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['even-swap'],
                    inPlay: ['tribune-pompitus', 'exeldon-yash']
                },
                player2: {
                    inPlay: ['flaxia', 'urchin']
                }
            });
            // Exeldon Yash relies on Tribune Pompitus's buff to survive its
            // accumulated damage. Once Pompitus is given to the opponent, Yash
            // loses the buff and dies before being given.
            this.exeldonYash.amber = 1;
            this.exeldonYash.damage = 4;
        });

        it('does not allow taking enemy creatures since only one was given', function () {
            const startingAmber = this.player1.amber;
            const startingOpponentAmber = this.player2.amber;
            this.player1.play(this.evenSwap);
            this.player1.clickCard(this.tribunePompitus);
            this.player1.clickPrompt('Left');
            expect(this.tribunePompitus.controller).toBe(this.player2.player);
            expect(this.exeldonYash.location).toBe('discard');
            expect(this.flaxia.controller).toBe(this.player2.player);
            expect(this.urchin.controller).toBe(this.player2.player);
            // +1 from the card's printed amber bonus. Yash died on player1's
            // side, so its amber goes to the opponent.
            expect(this.player1.amber).toBe(startingAmber + 1);
            expect(this.player2.amber).toBe(startingOpponentAmber + 1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
