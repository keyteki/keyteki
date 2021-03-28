describe('It´s Coming', function () {
    describe("It´s Coming's Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'saurian',
                    inPlay: ['senator-shrix'],
                    hand: ['deusillus', 'deusillus2', 'it-s-coming']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll', 'narp', 'zorg', 'collector-worm']
                }
            });

            // Fix house selection (multiple cards with same id)
            this.itSComing.printedHouse = 'saurian';
            this.itSComing.cardData.house = 'saurian';
        });

        it('should be able to return part 1 from deck', function () {
            this.player1.moveCard(this.deusillus, 'deck');
            this.player1.play(this.itSComing);
            expect(this.player1).toBeAbleToSelect(this.deusillus);
            expect(this.player1).not.toBeAbleToSelect(this.deusillus2);
            this.player1.clickCard(this.deusillus);
            this.player1.clickPrompt('Done');
            expect(this.deusillus.location).toBe('hand');
            expect(this.deusillus2.location).toBe('hand');
        });

        it('should be able to return part 2 from deck', function () {
            this.player1.moveCard(this.deusillus2, 'deck');
            this.player1.play(this.itSComing);
            expect(this.player1).toBeAbleToSelect(this.deusillus2);
            expect(this.player1).not.toBeAbleToSelect(this.deusillus);
            this.player1.clickCard(this.deusillus2);
            this.player1.clickPrompt('Done');
            expect(this.deusillus.location).toBe('hand');
            expect(this.deusillus2.location).toBe('hand');
        });

        it('should be able to return part 1 from discard', function () {
            this.player1.moveCard(this.deusillus, 'discard');
            this.player1.play(this.itSComing);
            expect(this.player1).toBeAbleToSelect(this.deusillus);
            expect(this.player1).not.toBeAbleToSelect(this.deusillus2);
            this.player1.clickCard(this.deusillus);
            this.player1.clickPrompt('Done');
            expect(this.deusillus.location).toBe('hand');
            expect(this.deusillus2.location).toBe('hand');
        });

        it('should be able to return part 2 from discard', function () {
            this.player1.moveCard(this.deusillus2, 'discard');
            this.player1.play(this.itSComing);
            expect(this.player1).toBeAbleToSelect(this.deusillus2);
            expect(this.player1).not.toBeAbleToSelect(this.deusillus);
            this.player1.clickCard(this.deusillus2);
            this.player1.clickPrompt('Done');
            expect(this.deusillus.location).toBe('hand');
            expect(this.deusillus2.location).toBe('hand');
        });

        it('should be able to return part 1 or 2 from deck or discard', function () {
            this.player1.moveCard(this.deusillus, 'discard');
            this.player1.moveCard(this.deusillus2, 'deck');
            this.player1.play(this.itSComing);
            expect(this.player1).toBeAbleToSelect(this.deusillus);
            expect(this.player1).toBeAbleToSelect(this.deusillus2);
            this.player1.clickCard(this.deusillus);
            this.player1.clickPrompt('Done');
            expect(this.deusillus.location).toBe('hand');
            expect(this.deusillus2.location).toBe('deck');
        });
    });
});
