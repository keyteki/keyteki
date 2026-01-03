describe('Build Your Champion', function () {
    describe("Build Your Champion's Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'saurian',
                    inPlay: ['senator-shrix'],
                    hand: ['deusillus', 'deusillus2', 'build-your-champion'],
                    discard: ['stomp']
                },
                player2: {
                    amber: 1
                }
            });

            this.buildYourChampion.printedHouse = 'saurian';
            this.buildYourChampion.cardData.house = 'saurian';
        });

        it('should be able to return parts from deck and discard', function () {
            this.player1.moveCard(this.deusillus, 'deck');
            this.player1.moveCard(this.deusillus2, 'discard');
            this.player1.play(this.buildYourChampion);
            expect(this.player1).toBeAbleToSelect(this.deusillus);
            expect(this.player1).toBeAbleToSelect(this.deusillus2);
            expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).not.toBeAbleToSelect(this.stomp);
            this.player1.clickCard(this.deusillus);
            this.player1.clickCard(this.deusillus2);
            this.player1.clickPrompt('Done');
            expect(this.deusillus.location).toBe('archives');
            expect(this.deusillus2.location).toBe('archives');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should work when 1 part is already archived', function () {
            this.player1.moveCard(this.deusillus, 'deck');
            this.player1.play(this.buildYourChampion);
            expect(this.player1).toBeAbleToSelect(this.deusillus);
            expect(this.player1).not.toBeAbleToSelect(this.deusillus2);
            expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).not.toBeAbleToSelect(this.stomp);
            this.player1.clickCard(this.deusillus);
            this.player1.clickPrompt('Done');
            expect(this.deusillus.location).toBe('archives');
            expect(this.deusillus2.location).toBe('hand');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should be able to fail the search', function () {
            this.player1.moveCard(this.deusillus, 'deck');
            this.player1.moveCard(this.deusillus2, 'discard');
            this.player1.play(this.buildYourChampion);
            this.player1.clickPrompt('Done');
            expect(this.deusillus.location).toBe('deck');
            expect(this.deusillus2.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
