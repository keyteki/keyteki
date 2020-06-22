describe('Hexpion', function () {
    describe("Hexpion' destroyed ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['hexpion', 'troll'],
                    hand: []
                },
                player2: {
                    inPlay: ['krump'],
                    hand: ['collar-of-subordination']
                }
            });
        });

        it('should move destroyed hexpion to archive', function () {
            this.player1.fightWith(this.hexpion, this.krump);

            expect(this.hexpion.location).toBe('archives');
            expect(this.player1.archives).toContain(this.hexpion);
            expect(this.player1.player.archives.length).toBe(2);
        });

        it("should move controlled hexpion to opponent's archive", function () {
            this.player1.endTurn();

            this.player2.clickPrompt('dis');
            this.player2.playUpgrade(this.collarOfSubordination, this.hexpion);
            this.player2.clickPrompt('Left');
            this.player2.endTurn();

            this.player1.clickPrompt('brobnar');
            this.player1.fightWith(this.troll, this.hexpion);

            expect(this.hexpion.location).toBe('archives');
            expect(this.player1.archives).toContain(this.hexpion);
            expect(this.player1.archives.length).toBe(1);
            expect(this.player2.archives.length).toBe(1);
        });
    });
});
