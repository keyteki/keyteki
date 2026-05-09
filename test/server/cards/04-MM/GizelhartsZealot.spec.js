describe('Gizelharts Zealot', function () {
    describe("Gizelharts Zealot's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['gizelhart-s-zealot'],
                    inPlay: ['lamindra', 'urchin']
                },
                player2: {
                    inPlay: ['ancient-bear', 'duskwitch', 'niffle-ape']
                }
            });

            this.player1.play(this.gizelhartSZealot);
        });

        it('should enter play ready and enraged', function () {
            expect(this.gizelhartSZealot.location).toBe('play area');
            expect(this.gizelhartSZealot.enraged).toBe(true);
            expect(this.gizelhartSZealot.exhausted).toBe(false);
            this.player1.endTurn();
        });

        it('should be able to use it to fight', function () {
            this.player1.clickCard(this.gizelhartSZealot);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton('Fight with this creature');
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.niffleApe);
            expect(this.gizelhartSZealot.damage).toBe(3);
            expect(this.gizelhartSZealot.enraged).toBe(false);
        });
    });
});
