describe('Vĕsted Harŏld', function () {
    describe("Vĕsted Harŏld's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['exchange-program', 'vĕsted-harŏld'],
                    inPlay: ['gub', 'troll']
                },
                player2: {
                    inPlay: ['dust-pixie', 'infurnace']
                }
            });
        });

        it('should allow you to archive a friendly and enemy creatures on scrap', function () {
            this.player1.scrap(this.vĕstedHarŏld);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.infurnace);
            this.player1.clickCard(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.infurnace);
            this.player1.clickCard(this.dustPixie);
            expect(this.gub.location).toBe('archives');
            expect(this.player1.player.archives).toContain(this.gub);
            expect(this.troll.location).toBe('play area');
            expect(this.dustPixie.location).toBe('archives');
            expect(this.player2.player.archives).toContain(this.dustPixie);
            expect(this.infurnace.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should archive into owner archives', function () {
            this.player1.play(this.exchangeProgram);
            this.player1.clickCard(this.gub);
            this.player1.clickCard(this.dustPixie);
            this.player1.scrap(this.vĕstedHarŏld);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.gub);
            expect(this.gub.location).toBe('archives');
            expect(this.player1.player.archives).toContain(this.gub);
            expect(this.troll.location).toBe('play area');
            expect(this.dustPixie.location).toBe('archives');
            expect(this.player2.player.archives).toContain(this.dustPixie);
            expect(this.infurnace.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
