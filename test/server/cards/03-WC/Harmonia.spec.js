describe('Harmonia', function () {
    describe("Harmonia's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'untamed',
                    hand: ['rustgnawer', 'dust-pixie', 'dew-faerie', 'duskwitch', 'harmonia']
                },
                player2: {
                    amber: 2,
                    inPlay: ['mother', 'brain-eater', 'dextre', 'daughter'],
                    hand: ['remote-access']
                }
            });
        });

        it('should cause the player to gain an amber when they play a creature if they have less in play than their opponent', function () {
            this.player1.play(this.harmonia);
            expect(this.player1.amber).toBe(3);
            this.player1.play(this.dustPixie);
            expect(this.player1.amber).toBe(6);
            this.player1.play(this.rustgnawer);
            expect(this.player1.amber).toBe(7);
            this.player1.play(this.dewFaerie);
            expect(this.player1.amber).toBe(7);
            this.player1.play(this.duskwitch);
            expect(this.player1.amber).toBe(7);
        });

        it('should not trigger when a creature play is cancelled at the flank prompt', function () {
            this.player1.play(this.harmonia);
            const startAmber = this.player1.amber;
            this.player1.clickCard(this.dustPixie);
            expect(this.player1).toHavePromptButton('Cancel');
            this.player1.clickPrompt('Cancel');
            expect(this.dustPixie.location).toBe('hand');
            expect(this.player1.amber).toBe(startAmber);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
