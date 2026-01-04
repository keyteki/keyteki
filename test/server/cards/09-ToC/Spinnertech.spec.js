describe('Spinnertech', function () {
    describe("Spinnertech's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    token: 'minion',
                    hand: ['spinnertech'],
                    inPlay: ['touchstone'],
                    deck: new Array(12).fill('toad'),
                    discard: ['dust-pixie', 'hunting-witch', 'full-moon']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll'],
                    discard: ['krump']
                }
            });

            this.minion1 = this.player1.player.deck[0];
        });

        it('should put a card on top and make a token on play', function () {
            this.player1.playCreature(this.spinnertech);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.fullMoon);
            expect(this.player1).not.toBeAbleToSelect(this.touchstone);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.fullMoon);
            this.player1.clickPrompt('Left');
            expect(this.fullMoon.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should put a card on top and make a token on destroyed', function () {
            this.player1.playCreature(this.spinnertech);
            this.player1.clickCard(this.fullMoon);
            this.player1.clickPrompt('Left');
            this.spinnertech.exhausted = false;
            this.player1.fightWith(this.spinnertech, this.troll);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.fullMoon);
            expect(this.player1).not.toBeAbleToSelect(this.touchstone);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.spinnertech);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Left');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should work with no cards in discard', function () {
            this.player1.player.discard = [];
            this.player1.playCreature(this.spinnertech);
            this.player1.clickPrompt('Left');
            expect(this.minion1.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
