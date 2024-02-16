describe('Thoughtswim', function () {
    describe("Thoughtswim's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['thoughtswim'],
                    inPlay: ['bubbles', 'skullback-crab']
                },
                player2: {
                    hand: ['kerwollop', 'too-much-to-protect'],
                    inPlay: ['seeker-needle', 'a-vinda', 'scylla'],
                    discard: new Array(9).fill('poke') // not yet haunted
                }
            });
            this.player1.playUpgrade(this.thoughtswim, this.bubbles);
        });

        it('can be damaged by unhaunted players when attacked', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.aVinda, this.bubbles);
            expect(this.bubbles.tokens.damage).toBe(4);
        });

        it('can be damaged by unhaunted players when attacking', function () {
            this.player1.fightWith(this.bubbles, this.aVinda);
            expect(this.bubbles.tokens.damage).toBe(4);
        });

        it('can be damaged by unhaunted players using abilities', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.reap(this.aVinda);
            this.player2.clickCard(this.bubbles);
            expect(this.bubbles.tokens.damage).toBe(1);
        });

        it('can be damaged by self when opponent not haunted using abilities', function () {
            this.player1.reap(this.bubbles);
            expect(this.bubbles.tokens.damage).toBe(4);
        });

        it('cannot be damaged by haunted players when attacked', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.tooMuchToProtect);
            this.player2.fightWith(this.aVinda, this.bubbles);
            expect(this.bubbles.tokens.damage).toBe(undefined);
        });

        it('cannot be damaged by haunted players when attacking', function () {
            this.player1.fightWith(this.skullbackCrab, this.scylla);
            this.player1.fightWith(this.bubbles, this.aVinda);
            expect(this.bubbles.tokens.damage).toBe(undefined);
        });

        it('cannot be damaged by haunted players using abilities', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.tooMuchToProtect);
            this.player2.reap(this.aVinda);
            this.player2.clickCard(this.bubbles);
            expect(this.bubbles.tokens.damage).toBe(undefined);
        });

        it('cannot be damaged by self when opponent is haunted using abilities', function () {
            this.player1.fightWith(this.skullbackCrab, this.aVinda);
            this.player1.reap(this.bubbles);
            expect(this.bubbles.tokens.damage).toBe(undefined);
        });
    });
});
