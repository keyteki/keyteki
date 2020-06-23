describe('Annihilation Ritual', function () {
    describe("Annihilation Ritual's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['annihilation-ritual-', 'ember-imp', 'guardian-demon', 'the-terror'],
                    hand: ['hand-of-dis', 'pitlord']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'snufflegator', 'inka-the-spider']
                }
            });
        });

        it('should purge its controllers creatures', function () {
            this.player1.play(this.handOfDis);
            expect(this.player1).toHavePrompt('Hand of Dis');
            this.player1.clickCard(this.guardianDemon);
            expect(this.guardianDemon.location).toBe('purged');
        });

        it("should purge opponent's creatures", function () {
            this.player1.play(this.handOfDis);
            expect(this.player1).toHavePrompt('Hand of Dis');
            this.player1.clickCard(this.snufflegator);
            expect(this.snufflegator.location).toBe('purged');
        });

        it('should not purge discarded creatures', function () {
            this.player1.clickCard(this.pitlord);
            this.player1.clickPrompt('Discard this card');
            expect(this.pitlord.location).toBe('discard');
        });
    });
});
