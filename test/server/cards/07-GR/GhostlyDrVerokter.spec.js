describe('Ghostly Dr. Verokter', function () {
    describe("Ghostly Dr. Verokter's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['opposition-research', 'ghostly-dr-verokter'],
                    discard: ['flaxia', 'full-moon'].concat(new Array(8).fill('poke'))
                },
                player2: {
                    inPlay: ['troll'],
                    discard: ['press-gang']
                }
            });
            this.player1.chains = 36;
            this.player1.playCreature(this.ghostlyDrVerokter);
        });

        it('moves a card from discard to top of deck on play', function () {
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.fullMoon);
            expect(this.player1).toBeAbleToSelect(this.poke);
            expect(this.player1).not.toBeAbleToSelect(this.ghostlyDrVerokter);
            expect(this.player1).not.toBeAbleToSelect(this.oppositionResearch);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.pressGang);
            this.player1.clickCard(this.fullMoon);
            expect(this.fullMoon.location).toBe('deck');
            expect(this.player1.player.deck[0]).toBe(this.fullMoon);
            this.expectReadyToTakeAction(this.player1);
        });

        describe('after play', function () {
            beforeEach(function () {
                this.player1.clickCard(this.fullMoon);
                this.player1.endTurn();
                this.player2.clickPrompt('brobnar');
                this.player2.endTurn();
                this.player1.clickPrompt('logos');
            });

            it('moves a card from discard to top of deck on reap', function () {
                this.player1.reap(this.ghostlyDrVerokter, this.troll);
                this.player1.clickCard(this.flaxia);
                expect(this.flaxia.location).toBe('deck');
                expect(this.player1.player.deck[0]).toBe(this.flaxia);
                this.expectReadyToTakeAction(this.player1);
            });

            it('does not archive on destroy if not haunted', function () {
                this.player1.fightWith(this.ghostlyDrVerokter, this.troll);
                expect(this.ghostlyDrVerokter.location).toBe('discard');
                this.expectReadyToTakeAction(this.player1);
            });

            it('archives on destroy if haunted', function () {
                this.player1.play(this.oppositionResearch);
                this.player1.fightWith(this.ghostlyDrVerokter, this.troll);
                expect(this.ghostlyDrVerokter.location).toBe('archives');
                this.expectReadyToTakeAction(this.player1);
            });
        });
    });
});
