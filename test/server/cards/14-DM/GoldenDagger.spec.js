describe('GoldenDagger', function () {
    describe("Golden Dagger's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['golden-dagger']
                },
                player2: {
                    inPlay: ['troll', 'urchin']
                }
            });
        });

        it('deals 3 damage and gains 1 amber for the owner when the damage destroys an enemy creature', function () {
            this.player1.reap(this.goldenDagger);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.player2.amber).toBe(1);
            expect(this.player1.amber).toBe(1); // 1 from reap
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals 3 damage but does not destroy a tougher creature, no amber gained', function () {
            this.player1.reap(this.goldenDagger);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(3);
            expect(this.troll.location).toBe('play area');
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Golden Dagger destroying a friendly creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['golden-dagger', 'urchin']
                },
                player2: {}
            });
        });

        it('gains 1 amber for the friendly owner', function () {
            this.player1.reap(this.goldenDagger);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1.amber).toBe(2); // 1 from reap + 1 from owner gain
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Golden Dagger and changed control', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['even-swap'],
                    inPlay: ['golden-dagger', 'urchin', 'snufflegator']
                },
                player2: {
                    inPlay: ['flaxia', 'exeldon-yash']
                }
            });
        });

        it('credits amber to the original owner even when the creature has changed control', function () {
            this.player1.play(this.evenSwap);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.snufflegator);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.exeldonYash);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            expect(this.urchin.controller).toBe(this.player2.player);
            this.player1.reap(this.goldenDagger);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            // owner is still player1, so player1 gains the amber
            expect(this.player1.amber).toBe(3); // 1 even-swap bonus + 1 reap + 1 owner gain
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
