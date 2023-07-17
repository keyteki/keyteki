describe('Friendly Guide', function () {
    describe("Friendly Guide's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['niffle-ape', 'friendly-guide', 'dark-faerie', 'rustgnawer']
                },
                player2: {
                    inPlay: ['dextre', 'hunting-witch', 'shĭzyokŭ-swopper']
                }
            });
        });

        it('should allow use on reap', function () {
            this.player1.reap(this.niffleApe);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.friendlyGuide);
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.huntingWitch);
            expect(this.huntingWitch.location).toBe('discard');
        });

        it('should allow use on fight', function () {
            this.player1.fightWith(this.darkFaerie, this.huntingWitch);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.friendlyGuide);
            this.player1.clickPrompt('Reap with this creature');
        });

        it('should allow use on fight where attacker dies', function () {
            this.player1.fightWith(this.niffleApe, this.dextre);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.friendlyGuide);
            this.player1.clickPrompt('Reap with this creature');
        });

        it('should only work on neighboring creatures', function () {
            this.player1.reap(this.rustgnawer);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not work for opponent after a swap', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('ekwidon');
            this.player2.fightWith(this.shĭzyokŭSwopper, this.niffleApe);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
