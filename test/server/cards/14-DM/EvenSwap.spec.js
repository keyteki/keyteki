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
            expect(this.urchin.controller).toBe(this.player2.player);
            // Second give: only the remaining friendly creature is selectable.
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.snufflegator);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.exeldonYash);
            this.player1.clickCard(this.snufflegator);
            this.player1.clickPrompt('Left');
            expect(this.snufflegator.controller).toBe(this.player2.player);
            // Take phase: every creature is now controlled by the opponent, all selectable.
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.exeldonYash);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.snufflegator);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.controller).toBe(this.player1.player);
            this.player1.clickCard(this.exeldonYash);
            this.player1.clickPrompt('Left');
            expect(this.urchin.controller).toBe(this.player2.player);
            expect(this.snufflegator.controller).toBe(this.player2.player);
            expect(this.flaxia.controller).toBe(this.player1.player);
            expect(this.exeldonYash.controller).toBe(this.player1.player);

            const logs = this.getChatLogs(10);
            expect(logs).toContain('player1 uses Even Swap to give control of Urchin to player2');
            expect(logs).toContain(
                'player1 uses Even Swap to give control of Snufflegator to player2'
            );
            expect(logs).toContain('player1 uses Even Swap to take control of Flaxia');
            expect(logs).toContain('player1 uses Even Swap to take control of Exeldon Yash');

            expect(this.player1).isReadyToTakeAction();
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.urchin.controller).toBe(this.player2.player);
            expect(this.snufflegator.controller).toBe(this.player2.player);
            expect(this.flaxia.controller).toBe(this.player1.player);
            expect(this.exeldonYash.controller).toBe(this.player1.player);
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            expect(this.urchin.controller).toBe(this.player2.player);
            expect(this.snufflegator.controller).toBe(this.player2.player);
            expect(this.flaxia.controller).toBe(this.player1.player);
            expect(this.exeldonYash.controller).toBe(this.player1.player);
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

        it('gives the only friendly creature and takes none', function () {
            this.player1.play(this.evenSwap);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Left');
            expect(this.urchin.controller).toBe(this.player2.player);
            expect(this.flaxia.controller).toBe(this.player2.player);
            expect(this.exeldonYash.controller).toBe(this.player2.player);
            expect(this.player1).isReadyToTakeAction();
            this.player1.endTurn();

            const logs = this.getChatLogs(10);
            expect(logs).toContain('player1 uses Even Swap to give control of Urchin to player2');

            this.player2.clickPrompt('untamed');
            expect(this.urchin.controller).toBe(this.player2.player);
            expect(this.flaxia.controller).toBe(this.player2.player);
            expect(this.exeldonYash.controller).toBe(this.player2.player);
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            expect(this.urchin.controller).toBe(this.player2.player);
            expect(this.flaxia.controller).toBe(this.player2.player);
            expect(this.exeldonYash.controller).toBe(this.player2.player);
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
            expect(this.evenSwap.location).toBe('discard');
            expect(this.flaxia.controller).toBe(this.player2.player);
            expect(this.exeldonYash.controller).toBe(this.player2.player);
            expect(this.player1).isReadyToTakeAction();

            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.flaxia.controller).toBe(this.player2.player);
            expect(this.exeldonYash.controller).toBe(this.player2.player);
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            expect(this.flaxia.controller).toBe(this.player2.player);
            expect(this.exeldonYash.controller).toBe(this.player2.player);
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
            expect(this.urchin.controller).toBe(this.player2.player);
            this.player1.clickCard(this.snufflegator);
            this.player1.clickPrompt('Left');
            expect(this.snufflegator.controller).toBe(this.player2.player);
            // Now player2 controls flaxia, urchin, snufflegator. Take 2 back.
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.controller).toBe(this.player1.player);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Left');
            expect(this.flaxia.controller).toBe(this.player1.player);
            expect(this.urchin.controller).toBe(this.player1.player);
            expect(this.snufflegator.controller).toBe(this.player2.player);
            expect(this.player1).isReadyToTakeAction();
            this.player1.endTurn();

            this.player2.clickPrompt('untamed');
            expect(this.flaxia.controller).toBe(this.player1.player);
            expect(this.urchin.controller).toBe(this.player1.player);
            expect(this.snufflegator.controller).toBe(this.player2.player);
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            expect(this.flaxia.controller).toBe(this.player1.player);
            expect(this.urchin.controller).toBe(this.player1.player);
            expect(this.snufflegator.controller).toBe(this.player2.player);
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
            expect(this.urchin.controller).toBe(this.player2.player);
            this.player1.clickCard(this.snufflegator);
            this.player1.clickPrompt('Left');
            expect(this.urchin.controller).toBe(this.player2.player);
            expect(this.snufflegator.controller).toBe(this.player2.player);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.controller).toBe(this.player1.player);
            this.player1.clickCard(this.snufflegator);
            this.player1.clickPrompt('Left');
            expect(this.urchin.controller).toBe(this.player1.player);
            expect(this.snufflegator.controller).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();

            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.urchin.controller).toBe(this.player1.player);
            expect(this.snufflegator.controller).toBe(this.player1.player);
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            expect(this.urchin.controller).toBe(this.player1.player);
            expect(this.snufflegator.controller).toBe(this.player1.player);
        });
    });

    describe("Even Swap's ability with Tribune Pompitus", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['even-swap'],
                    inPlay: ['tribune-pompitus', 'exeldon-yash', 'cŏnrăd-fisiquĕ']
                },
                player2: {
                    inPlay: []
                }
            });
            // Each given creature has 1 amber and enough damage that without
            // Tribune Pompitus's +2 power per A, it would be destroyed.
            this.exeldonYash.amber = 1;
            this.exeldonYash.damage = 4;
            this.cŏnrădFisiquĕ.amber = 1;
            this.cŏnrădFisiquĕ.damage = 3;
        });

        it('gives 2 creatures who die on the opponent side and player1 gains their amber', function () {
            this.player1.play(this.evenSwap);
            this.player1.clickCard(this.exeldonYash);
            expect(this.exeldonYash.location).toBe('discard');
            this.player1.clickCard(this.cŏnrădFisiquĕ);
            expect(this.cŏnrădFisiquĕ.location).toBe('discard');
            expect(this.tribunePompitus.controller).toBe(this.player1.player);
            expect(this.player1.amber).toBe(3);
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
            this.player1.play(this.evenSwap);
            this.player1.clickCard(this.tribunePompitus);
            this.player1.clickPrompt('Left');
            expect(this.tribunePompitus.controller).toBe(this.player2.player);
            expect(this.exeldonYash.location).toBe('discard');
            expect(this.flaxia.controller).toBe(this.player2.player);
            expect(this.urchin.controller).toBe(this.player2.player);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();

            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.tribunePompitus.controller).toBe(this.player2.player);
            expect(this.exeldonYash.location).toBe('discard');
            expect(this.flaxia.controller).toBe(this.player2.player);
            expect(this.urchin.controller).toBe(this.player2.player);
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            expect(this.tribunePompitus.controller).toBe(this.player2.player);
            expect(this.exeldonYash.location).toBe('discard');
            expect(this.flaxia.controller).toBe(this.player2.player);
            expect(this.urchin.controller).toBe(this.player2.player);
        });
    });

    describe("Even Swap's ability when both given creatures die immediately", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['even-swap'],
                    inPlay: ['tribune-pompitus', 'exeldon-yash', 'cŏnrăd-fisiquĕ']
                },
                player2: {
                    inPlay: ['flaxia', 'urchin']
                }
            });
            // Pompitus's +2 power per A keeps these damaged creatures alive
            // while on player1's side. Once given to player2, they lose the
            // buff and die.
            this.exeldonYash.amber = 1;
            this.exeldonYash.damage = 4;
            this.cŏnrădFisiquĕ.amber = 1;
            this.cŏnrădFisiquĕ.damage = 3;
        });

        it('still allows taking 2 enemy creatures', function () {
            this.player1.play(this.evenSwap);
            this.player1.clickCard(this.exeldonYash);
            this.player1.clickPrompt('Left');
            expect(this.exeldonYash.location).toBe('discard');
            this.player1.clickCard(this.cŏnrădFisiquĕ);
            this.player1.clickPrompt('Left');
            expect(this.cŏnrădFisiquĕ.location).toBe('discard');
            // Both given creatures died on player2's side. Take phase still
            // proceeds with the 2 enemy creatures available.
            this.player1.clickCard(this.flaxia);
            this.player1.clickPrompt('Left');
            expect(this.flaxia.controller).toBe(this.player1.player);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Left');
            expect(this.urchin.controller).toBe(this.player1.player);
            expect(this.tribunePompitus.controller).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();

            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.flaxia.controller).toBe(this.player1.player);
            expect(this.urchin.controller).toBe(this.player1.player);
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            expect(this.flaxia.controller).toBe(this.player1.player);
            expect(this.urchin.controller).toBe(this.player1.player);
        });
    });

    describe("Even Swap's ability when taking the first creature destroys all creatures", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['even-swap'],
                    inPlay: ['urchin', 'snufflegator']
                },
                player2: {
                    inPlay: ['tribune-pompitus', 'harbinger-of-doom']
                }
            });
            // Harbinger of Doom survives its damage only because Tribune
            // Pompitus's +2 power per A keeps it alive. Once Pompitus changes
            // controller, Harbinger dies and triggers "destroy each creature".
            this.harbingerOfDoom.amber = 2;
            this.harbingerOfDoom.damage = 3;
        });

        it('skips the second take because no creatures remain', function () {
            this.player1.play(this.evenSwap);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Left');
            expect(this.urchin.controller).toBe(this.player2.player);
            this.player1.clickCard(this.snufflegator);
            this.player1.clickPrompt('Left');
            expect(this.snufflegator.controller).toBe(this.player2.player);
            this.player1.clickCard(this.tribunePompitus);
            expect(this.tribunePompitus.location).toBe('discard');
            expect(this.harbingerOfDoom.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
            expect(this.snufflegator.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
