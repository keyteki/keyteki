describe('Dredging Druid', function () {
    describe("Dredging Druid's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'untamed',
                    inPlay: ['dredging-druid'],
                    discard: [
                        'mimicry',
                        'bear-flute',
                        'cephaloist',
                        'chota-hazri',
                        'ancient-bear',
                        'archimedes'
                    ]
                },
                player2: {
                    amber: 2,
                    discard: ['murkens']
                }
            });
        });

        describe('when the tide is neutral', function () {
            beforeEach(function () {
                this.player1.reap(this.dredgingDruid);
            });

            it('should not prompt for creatures', function () {
                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('when the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
                this.player1.reap(this.dredgingDruid);
            });

            it('should not prompt for creatures', function () {
                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
                this.player1.reap(this.dredgingDruid);
            });

            it('should be able to select only creatures from own discard', function () {
                expect(this.player1).not.toBeAbleToSelect(this.mimicry);
                expect(this.player1).not.toBeAbleToSelect(this.bearFlute);
                expect(this.player1).toBeAbleToSelect(this.cephaloist);
                expect(this.player1).toBeAbleToSelect(this.chotaHazri);
                expect(this.player1).toBeAbleToSelect(this.ancientBear);
                expect(this.player1).toBeAbleToSelect(this.archimedes);
                expect(this.player1).not.toBeAbleToSelect(this.murkens);
            });

            it('should be able to not choose any creature', function () {
                this.player1.clickPrompt('Done');
                expect(this.player1).isReadyToTakeAction();
            });

            it('should be able to select up to 3', function () {
                this.player1.clickCard(this.cephaloist);
                this.player1.clickCard(this.chotaHazri);
                this.player1.clickCard(this.archimedes);
                this.player1.clickPrompt('Done');
                expect(this.player1).isReadyToTakeAction();
                expect(this.player1.player.deck[0]).toBe(this.archimedes);
                expect(this.player1.player.deck[1]).toBe(this.chotaHazri);
                expect(this.player1.player.deck[2]).toBe(this.cephaloist);
            });
        });
    });
});
