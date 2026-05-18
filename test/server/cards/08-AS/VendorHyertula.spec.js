describe('Vendor Hyertula', function () {
    describe("Vendor Hyertula's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    inPlay: ['vendor-hyertula', 'ornate-talking-tray']
                },
                player2: {
                    amber: 6,
                    inPlay: ['library-of-babble', 'ritual-of-balance', 'uncommon-currency']
                }
            });
        });

        it('should allow you to not destroy itself', function () {
            this.player1.reap(this.vendorHyertula);
            expect(this.player1).toBeAbleToSelect(this.vendorHyertula);
            this.player1.clickPrompt('Done');
            expect(this.vendorHyertula.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow you to take control of an artifact', function () {
            this.player1.reap(this.vendorHyertula);
            this.player1.clickCard(this.vendorHyertula);
            expect(this.vendorHyertula.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.libraryOfBabble);
            expect(this.player1).toBeAbleToSelect(this.ritualOfBalance);
            expect(this.player1).toBeAbleToSelect(this.uncommonCurrency);
            expect(this.player1).not.toBeAbleToSelect(this.ornateTalkingTray);
            this.player1.clickCard(this.ritualOfBalance);
            expect(this.ritualOfBalance.controller).toBe(this.player1.player);
            this.player1.useAction(this.ritualOfBalance);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should revert the artifact to its original house after losing control', function () {
            this.player1.reap(this.vendorHyertula);
            this.player1.clickCard(this.vendorHyertula);
            this.player1.clickCard(this.ritualOfBalance);
            this.player1.useAction(this.ritualOfBalance);
            this.player1.endTurn();
            this.player2.clickPrompt('ekwidon');
            this.player2.useAction(this.uncommonCurrency);
            this.player2.clickCard(this.ritualOfBalance);
            this.player2.clickCard(this.ritualOfBalance);
            expect(this.player2).isReadyToTakeAction();
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.useAction(this.ritualOfBalance);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when the opponent has no artifacts', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    inPlay: ['vendor-hyertula']
                },
                player2: {
                    amber: 6
                }
            });
        });

        it('should still allow you to destroy Vendor Hyertula and take nothing', function () {
            this.player1.reap(this.vendorHyertula);
            expect(this.player1).toBeAbleToSelect(this.vendorHyertula);
            this.player1.clickCard(this.vendorHyertula);
            expect(this.vendorHyertula.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when Vendor Hyertula is warded', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    inPlay: ['vendor-hyertula']
                },
                player2: {
                    amber: 6,
                    inPlay: ['ritual-of-balance']
                }
            });
            this.vendorHyertula.ward(1);
            expect(this.vendorHyertula.warded).toBe(true);
        });

        it('should absorb the destruction and not take an enemy artifact', function () {
            this.player1.reap(this.vendorHyertula);
            this.player1.clickCard(this.vendorHyertula);
            expect(this.vendorHyertula.location).toBe('play area');
            expect(this.vendorHyertula.warded).toBe(false);
            expect(this.ritualOfBalance.controller).toBe(this.player2.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("when control of the artifact later returns to Vendor Hyertula's controller", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    inPlay: ['vendor-hyertula']
                },
                player2: {
                    amber: 0,
                    inPlay: ['ritual-of-balance', 'uncommon-currency']
                }
            });
        });

        it('should remain in house Ekwidon because the Vendor Hyertula effect does not expire', function () {
            // Player1 reaps Vendor Hyertula, taking control of Ritual of Balance.
            expect(this.ritualOfBalance.getHouses()).toEqual(['untamed']);
            this.player1.reap(this.vendorHyertula);
            this.player1.clickCard(this.vendorHyertula);
            this.player1.clickCard(this.ritualOfBalance);
            expect(this.ritualOfBalance.controller).toBe(this.player1.player);
            expect(this.ritualOfBalance.getHouses()).toEqual(['ekwidon']);

            // Player2 swaps Ritual of Balance back via their Uncommon Currency.
            this.player1.endTurn();
            this.player2.clickPrompt('ekwidon');
            this.player2.useAction(this.uncommonCurrency);
            this.player2.clickCard(this.ritualOfBalance);
            this.player2.clickCard(this.ritualOfBalance);
            expect(this.ritualOfBalance.controller).toBe(this.player2.player);
            expect(this.ritualOfBalance.getHouses()).toEqual(['untamed']);

            // Player1 swaps Ritual of Balance back via their Uncommon Currency.
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.uncommonCurrency.ready();
            this.player1.useAction(this.uncommonCurrency);
            this.player1.clickCard(this.ritualOfBalance);
            expect(this.ritualOfBalance.controller).toBe(this.player1.player);

            // The Vendor Hyertula house-change should still apply.
            expect(this.ritualOfBalance.getHouses()).toEqual(['ekwidon']);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when the artifact leaves play and re-enters before being taken back', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['vendor-hyertula', 'uncommon-currency']
                },
                player2: {
                    hand: ['bonded-auctioneer'],
                    inPlay: ['ritual-of-balance']
                }
            });
        });

        it('should not change house when the artifact re-enters play and is later taken via Uncommon Currency', function () {
            // Player1 reaps Vendor Hyertula, taking control of Ritual of Balance.
            expect(this.ritualOfBalance.getHouses()).toEqual(['untamed']);
            this.player1.reap(this.vendorHyertula);
            this.player1.clickCard(this.vendorHyertula);
            this.player1.clickCard(this.ritualOfBalance);
            expect(this.ritualOfBalance.controller).toBe(this.player1.player);
            expect(this.ritualOfBalance.getHouses()).toEqual(['ekwidon']);
            this.player1.endTurn();

            // Player2 scraps Bonded Auctioneer
            this.player2.clickPrompt('ekwidon');
            this.player2.scrap(this.bondedAuctioneer);
            this.player2.clickCard(this.ritualOfBalance);
            expect(this.ritualOfBalance.location).toBe('hand');
            expect(this.player2.player.hand).toContain(this.ritualOfBalance);
            this.player2.endTurn();

            // Player2 plays Ritual of Balance
            this.player1.clickPrompt('ekwidon');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.ritualOfBalance);
            expect(this.ritualOfBalance.location).toBe('play area');
            expect(this.ritualOfBalance.controller).toBe(this.player2.player);
            expect(this.ritualOfBalance.getHouses()).toEqual(['untamed']);
            this.player2.endTurn();

            // Player1 takes control of Ritual of Balance via Uncommon Currency.
            // Vendor Hyertula's effect should not re-apply to this new instance.
            this.player1.clickPrompt('ekwidon');
            this.player1.useAction(this.uncommonCurrency);
            this.player1.clickCard(this.ritualOfBalance);
            expect(this.ritualOfBalance.controller).toBe(this.player1.player);
            expect(this.ritualOfBalance.getHouses()).toEqual(['untamed']);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
