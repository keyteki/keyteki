describe('Squire Recruitment', function () {
    describe("Squire Recruitment's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 2,
                    token: 'cleric',
                    inPlay: ['flaxia'],
                    hand: [
                        'barrister-joya',
                        'sir-bevor',
                        'squire-recruitment',
                        'shorty',
                        'chelonia'
                    ]
                },
                player2: {
                    amber: 2,
                    inPlay: ['urchin', 'urchin']
                }
            });

            this.player1.moveCard(this.shorty, 'deck');
            this.player1.moveCard(this.chelonia, 'deck');
        });

        it('should make a token for each friendly knight', function () {
            this.player1.play(this.barristerJoya);
            this.player1.play(this.sirBevor);
            this.player1.play(this.squireRecruitment);
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');

            expect(this.player1.amber).toBe(3);
            expect(this.player1.inPlay.length).toBe(5);
            expect(this.shorty.location).toBe('play area');
            expect(this.chelonia.location).toBe('play area');
            expect(this.shorty.name).toBe('Cleric');
            expect(this.shorty.isToken()).toBe(true);
            expect(this.chelonia.name).toBe('Cleric');
            expect(this.chelonia.isToken()).toBe(true);
        });

        it('should not make a token for each friendly knight if there are none', function () {
            this.player1.play(this.squireRecruitment);

            expect(this.player1.inPlay.length).toBe(1);
            expect(this.player1.amber).toBe(3);
            expect(this.shorty.location).toBe('deck');
            expect(this.chelonia.location).toBe('deck');
        });
    });
});
