describe('Mating Season', function () {
    describe("Mating Season's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['grabber-jammer', 'dextre'],
                    hand: ['mating-season', 'mindwarper', 'tunk']
                },
                player2: {
                    inPlay: ['troll', 'chuff-ape', 'grommid']
                }
            });
        });

        it('should return each creature to its owners deck, and give amber', function () {
            this.player1.play(this.matingSeason);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.grabberJammer.location).toBe('deck');
            expect(this.chuffApe.location).toBe('deck');
            expect(this.grommid.location).toBe('deck');
            expect(this.dextre.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
        });
    });
});
