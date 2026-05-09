describe('Song of Spring', function () {
    describe("Song of Spring's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['song-of-spring', 'hunting-witch'],
                    inPlay: ['mighty-tiger'],
                    discard: ['witch-of-the-dawn', 'troll', 'dew-faerie'],
                    archives: ['snufflegator'],
                    deck: ['niffle-ape']
                },
                player2: {
                    inPlay: ['dust-pixie']
                }
            });
        });

        it('shuffles selected friendly Untamed creatures from hand, discard, or play back into the deck and cannot select Untamed creatures from archive, deck, or purge', function () {
            this.player1.moveCard(this.dewFaerie, 'purged');
            this.player1.play(this.songOfSpring);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).toBeAbleToSelect(this.witchOfTheDawn);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            // Untamed creatures outside hand/discard/battleline cannot be selected
            expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
            expect(this.player1).not.toBeAbleToSelect(this.niffleApe);
            expect(this.player1).not.toBeAbleToSelect(this.dewFaerie);
            this.player1.clickCard(this.huntingWitch);
            this.player1.clickCard(this.mightyTiger);
            this.player1.clickCard(this.witchOfTheDawn);
            this.player1.clickPrompt('Done');
            expect(this.huntingWitch.location).toBe('deck');
            expect(this.mightyTiger.location).toBe('deck');
            expect(this.witchOfTheDawn.location).toBe('deck');
            expect(this.troll.location).toBe('discard');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.snufflegator.location).toBe('archives');
            expect(this.dewFaerie.location).toBe('purged');
            expect(this.player1).isReadyToTakeAction();
        });

        it('allows selecting no creatures', function () {
            this.player1.play(this.songOfSpring);
            this.player1.clickPrompt('Done');
            expect(this.huntingWitch.location).toBe('hand');
            expect(this.mightyTiger.location).toBe('play area');
            expect(this.witchOfTheDawn.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
