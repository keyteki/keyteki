describe('Digging Up The Monster', function () {
    describe("Digging Up The Monster's Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'saurian',
                    inPlay: ['senator-shrix'],
                    hand: ['deusillus', 'deusillus2', 'digging-up-the-monster'],
                    discard: ['stomp']
                },
                player2: {
                    amber: 1
                }
            });

            this.diggingUpTheMonster.printedHouse = 'saurian';
            this.diggingUpTheMonster.cardData.house = 'saurian';
        });

        it('should be able to return parts from deck and discard', function () {
            this.player1.moveCard(this.deusillus, 'deck');
            this.player1.moveCard(this.deusillus2, 'discard');
            this.player1.play(this.diggingUpTheMonster);
            expect(this.player1).toBeAbleToSelect(this.deusillus);
            expect(this.player1).toBeAbleToSelect(this.deusillus2);
            expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).not.toBeAbleToSelect(this.stomp);
            this.player1.clickCard(this.deusillus);
            this.player1.clickCard(this.deusillus2);
            this.player1.clickPrompt('Done');
            expect(this.deusillus.location).toBe('deck');
            expect(this.deusillus2.location).toBe('deck');
            expect(this.player1.player.deck[1]).toBe(this.deusillus);
            expect(this.player1.player.deck[0]).toBe(this.deusillus2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be able to order based on click order', function () {
            this.player1.moveCard(this.deusillus, 'deck');
            this.player1.moveCard(this.deusillus2, 'discard');
            this.player1.play(this.diggingUpTheMonster);
            this.player1.clickCard(this.deusillus2);
            this.player1.clickCard(this.deusillus);
            this.player1.clickPrompt('Done');
            expect(this.deusillus.location).toBe('deck');
            expect(this.deusillus2.location).toBe('deck');
            expect(this.player1.player.deck[0]).toBe(this.deusillus);
            expect(this.player1.player.deck[1]).toBe(this.deusillus2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should work when 1 part is already archived', function () {
            this.player1.moveCard(this.deusillus, 'deck');
            this.player1.play(this.diggingUpTheMonster);
            expect(this.player1).toBeAbleToSelect(this.deusillus);
            expect(this.player1).not.toBeAbleToSelect(this.deusillus2);
            expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).not.toBeAbleToSelect(this.stomp);
            this.player1.clickCard(this.deusillus);
            this.player1.clickPrompt('Done');
            expect(this.deusillus.location).toBe('deck');
            expect(this.deusillus2.location).toBe('hand');
            expect(this.player1.player.deck[0]).toBe(this.deusillus);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be able to fail the search', function () {
            this.player1.moveCard(this.deusillus, 'deck');
            this.player1.moveCard(this.deusillus2, 'discard');
            this.player1.play(this.diggingUpTheMonster);
            this.player1.clickPrompt('Done');
            expect(this.deusillus.location).toBe('deck');
            expect(this.deusillus2.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
