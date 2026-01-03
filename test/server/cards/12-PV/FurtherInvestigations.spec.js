describe('Further Investigations', function () {
    describe("Further Investigations's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['further-investigations', 'krump', 'anger', 'uncharted-lands'],
                    inPlay: ['medic-ingram', 'cpo-zytar', 'urchin']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should destroy any number of friendly creatures and archive a card for each', function () {
            this.player1.play(this.furtherInvestigations);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.medicIngram);
            this.player1.clickCard(this.cpoZytar);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Done');
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.anger);
            expect(this.player1).toBeAbleToSelect(this.unchartedLands);
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.anger);
            this.player1.clickCard(this.unchartedLands);
            this.player1.clickPrompt('Done');
            expect(this.medicIngram.location).toBe('discard');
            expect(this.cpoZytar.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
            expect(this.player1.player.archives.length).toBe(3);
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.player1.player.archives).toContain(this.krump);
            expect(this.player1.player.archives).toContain(this.anger);
            expect(this.player1.player.archives).toContain(this.unchartedLands);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not archive any cards if no creatures are destroyed', function () {
            this.player1.play(this.furtherInvestigations);
            this.player1.clickPrompt('Done');
            expect(this.medicIngram.location).toBe('play area');
            expect(this.cpoZytar.location).toBe('play area');
            expect(this.urchin.location).toBe('play area');
            expect(this.player1.player.archives.length).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should archive fewer cards if hand has fewer cards than destroyed creatures', function () {
            this.player1.moveCard(this.krump, 'discard');
            this.player1.moveCard(this.anger, 'discard');
            this.player1.play(this.furtherInvestigations);
            this.player1.clickCard(this.medicIngram);
            this.player1.clickCard(this.cpoZytar);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.unchartedLands);
            this.player1.clickPrompt('Done');
            expect(this.player1.player.archives.length).toBe(1);
            expect(this.player1.player.archives).toContain(this.unchartedLands);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
