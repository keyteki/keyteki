describe('Ironyx Vatminder', function () {
    describe("Ironyx Vatminder's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'mars',
                    token: 'grunt',
                    inPlay: ['collector-worm'],
                    hand: ['ironyx-vatminder']
                },
                player2: {
                    amber: 4,
                    inPlay: ['alaka'],
                    hand: ['berserker-slam']
                }
            });

            this.versusCard = this.player1.deck[0];
        });

        it('should make a token creature', function () {
            this.player1.play(this.ironyxVatminder);
            this.player1.clickPrompt('Left');
            expect(this.ironyxVatminder.location).toBe('play area');
            let grunt = this.player1.inPlay[0];
            expect(grunt.id).toBe('grunt');
            expect(grunt.versusCard).toBe(this.versusCard);
            this.player1.endTurn();
        });
    });

    describe("Ironyx Vatminder's destroyed ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'mars',
                    token: 'grunt',
                    inPlay: ['collector-worm', 'ironyx-vatminder']
                },
                player2: {
                    amber: 4,
                    inPlay: ['alaka'],
                    hand: ['berserker-slam']
                }
            });
        });

        it("should make a token creature if destroyed during controller's turn", function () {
            this.versusCard = this.player1.deck[0];
            this.player1.fightWith(this.ironyxVatminder, this.alaka);
            this.player1.clickPrompt('Left');
            expect(this.ironyxVatminder.location).toBe('discard');
            let grunt = this.player1.inPlay[0];
            expect(grunt.id).toBe('grunt');
            expect(grunt.versusCard).toBe(this.versusCard);
            this.player1.endTurn();
        });

        it("should make a token creature if destroyed during opponent's turn", function () {
            this.player1.endTurn();
            this.versusCard = this.player1.deck[0];
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.berserkerSlam);
            this.player2.clickCard(this.ironyxVatminder);
            this.player2.clickPrompt('Left');
            expect(this.ironyxVatminder.location).toBe('discard');
            let grunt = this.player1.inPlay[0];
            expect(grunt.id).toBe('grunt');
            expect(grunt.versusCard).toBe(this.versusCard);
            this.player2.endTurn();
        });
    });
});
