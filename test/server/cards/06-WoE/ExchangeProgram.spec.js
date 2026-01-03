describe('Exchange Program', function () {
    describe("Exchange Program's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['antiquities-dealer'],
                    hand: ['exchange-program']
                },
                player2: {
                    inPlay: ['selwyn-the-fence', 'flaxia', 'bumpsy']
                }
            });
        });

        it('allows player to swap a flank creature with opponent', function () {
            this.player1.play(this.exchangeProgram);
            expect(this.player1).toBeAbleToSelect(this.antiquitiesDealer);
            expect(this.player1).not.toBeAbleToSelect(this.selwynTheFence);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.antiquitiesDealer);
            expect(this.player1).not.toBeAbleToSelect(this.antiquitiesDealer);
            expect(this.player1).toBeAbleToSelect(this.selwynTheFence);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.bumpsy);
            expect(this.player1.player.cardsInPlay).toContain(this.bumpsy);
            expect(this.player1.player.cardsInPlay).not.toContain(this.antiquitiesDealer);
            expect(this.player2.player.cardsInPlay).not.toContain(this.bumpsy);
            expect(this.player2.player.cardsInPlay).toContain(this.antiquitiesDealer);
            this.expectReadyToTakeAction(this.player1);
        });

        it('does nothing if no creatures in play one side', function () {
            this.player1.fightWith(this.antiquitiesDealer, this.flaxia);
            this.player1.play(this.exchangeProgram);
            expect(this.antiquitiesDealer.location).toBe('discard');
            expect(this.player1).not.toBeAbleToSelect(this.selwynTheFence);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            this.expectReadyToTakeAction(this.player1);
        });
    });

    describe("Exchange Program's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    token: 'grumpus',
                    inPlay: ['antiquities-dealer', 'grumpus:flaxia'],
                    hand: ['exchange-program', 'chelonia']
                },
                player2: {
                    inPlay: ['urchin', 'collector-worm', 'gub']
                }
            });
        });

        it('allows token house to be selectable', function () {
            this.player1.play(this.exchangeProgram);
            this.player1.clickCard(this.grumpus);
            this.player1.clickCard(this.gub);
            expect(this.player1.player.cardsInPlay).toContain(this.gub);
            expect(this.player2.player.cardsInPlay).toContain(this.grumpus);
            this.player1.endTurn();
            expect(this.player2).toHavePromptButton('shadows');
            expect(this.player2).toHavePromptButton('mars');
            expect(this.player2).toHavePromptButton('dis');
            expect(this.player2).toHavePromptButton('brobnar');
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.grumpus);
        });
    });
});
