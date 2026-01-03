describe('Offering to Kiligog', function () {
    describe("Offering to Kiligog's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    token: 'grumpus',
                    inPlay: ['offering-to-kiligog', 'pelf', 'skullback-crab']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should destroy a friendly creature and pick same one to put underneath', function () {
            this.player1.useAction(this.offeringToKiligog, true);
            this.player1.clickCard(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.skullbackCrab);
            this.player1.clickCard(this.pelf);
            expect(this.offeringToKiligog.childCards).toContain(this.pelf);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should destroy a friendly creature and pick a different once to put underneath', function () {
            this.player1.fightWith(this.skullbackCrab, this.troll);
            this.player1.useAction(this.offeringToKiligog, true);
            this.player1.clickCard(this.pelf);
            this.player1.clickCard(this.skullbackCrab);
            expect(this.offeringToKiligog.childCards).toContain(this.skullbackCrab);
            expect(this.pelf.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should place cards out as tokens', function () {
            this.player1.useAction(this.offeringToKiligog, true);
            this.player1.clickCard(this.pelf);
            this.player1.clickCard(this.pelf);

            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');

            this.player1.useAction(this.offeringToKiligog, true);
            this.player1.clickCard(this.skullbackCrab);
            this.player1.clickCard(this.skullbackCrab);

            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');

            this.player1.clickCard(this.offeringToKiligog);
            this.player1.clickPrompt("Use this card's Omni ability", 1);
            this.player1.clickCard(this.pelf);
            this.player1.clickPrompt('Right'); // skullback
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.pelf.location).toBe('play area');
            expect(this.pelf.name).toBe('Grumpus');
            expect(this.skullbackCrab.location).toBe('play area');
            expect(this.skullbackCrab.name).toBe('Grumpus');
            expect(this.offeringToKiligog.childCards.length).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should fizzle with no more friendly creatures', function () {
            this.player1.useAction(this.offeringToKiligog, true);
            this.player1.clickCard(this.pelf);
            this.player1.clickCard(this.pelf);

            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');

            this.player1.useAction(this.offeringToKiligog, true);
            this.player1.clickCard(this.skullbackCrab);
            this.player1.clickCard(this.skullbackCrab);

            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');

            this.player1.useAction(this.offeringToKiligog, true);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
