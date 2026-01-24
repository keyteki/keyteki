describe('Niffle Paw', function () {
    describe("Niffle Paw's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['antiquities-dealer', 'pelf'],
                    hand: ['niffle-paw']
                },
                player2: {
                    amber: 1,
                    inPlay: ['umbra']
                }
            });
        });

        it('when creature reaps, destroy it and move to an enemy creature', function () {
            this.player1.playUpgrade(this.nifflePaw, this.antiquitiesDealer);
            this.player1.reap(this.antiquitiesDealer);
            expect(this.antiquitiesDealer.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            this.player1.clickCard(this.umbra);
            expect(this.umbra.upgrades).toContain(this.nifflePaw);
        });

        it('when creature reaps, destroy it and move to a friendly creature', function () {
            this.player1.playUpgrade(this.nifflePaw, this.antiquitiesDealer);
            this.player1.reap(this.antiquitiesDealer);
            expect(this.antiquitiesDealer.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            this.player1.clickCard(this.pelf);
            expect(this.pelf.upgrades).toContain(this.nifflePaw);
        });

        it('when a warded creature reaps, it loses the ward and moves to another creature', function () {
            this.player1.playUpgrade(this.nifflePaw, this.antiquitiesDealer);
            this.antiquitiesDealer.tokens.ward = 1;
            this.player1.reap(this.antiquitiesDealer);
            expect(this.antiquitiesDealer.location).toBe('play area');
            expect(this.antiquitiesDealer.warded).toBe(false);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            this.player1.clickCard(this.pelf);
            expect(this.pelf.upgrades).toContain(this.nifflePaw);
        });

        it('destroys itself when there are no creatures left', function () {
            this.player1.playUpgrade(this.nifflePaw, this.antiquitiesDealer);
            this.player1.reap(this.antiquitiesDealer);
            expect(this.antiquitiesDealer.location).toBe('discard');
            this.player1.clickCard(this.umbra);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.reap(this.umbra);
            expect(this.umbra.location).toBe('discard');
            this.player2.clickCard(this.pelf);
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.reap(this.pelf);
            expect(this.pelf.location).toBe('discard');
            expect(this.nifflePaw.location).toBe('discard');
        });
    });
});
