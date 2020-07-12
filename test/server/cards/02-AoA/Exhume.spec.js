describe('Exhume', function () {
    describe("Exhume's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['flaxia'],
                    hand: ['exhume', 'gub', 'spyyyder'],
                    discard: ['glimmer', 'ancient-bear', 'bumblebird', 'shooler', 'explo-rover'],
                    amber: 4
                },
                player2: {
                    amber: 1,
                    inPlay: ['bumpsy', 'lifeward', 'quixxle-stone'],
                    discard: ['troll']
                }
            });
        });

        it('should allow selecting non-alpha creatures', function () {
            this.player1.play(this.exhume);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.glimmer);
            expect(this.player1).not.toBeAbleToSelect(this.bumblebird);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.shooler);
            this.player1.clickPrompt('Left');
            expect(this.shooler.location).toBe('play area');
        });

        it('should allow selecting explo-rover and playing it as an upgrade', function () {
            this.player1.play(this.exhume);
            this.player1.clickCard(this.exploRover);
            expect(this.player1).toHavePromptButton('Play this creature');
            expect(this.player1).toHavePromptButton('Play this upgrade');
            this.player1.clickPrompt('Play this upgrade');
            this.player1.clickCard(this.flaxia);
            expect(this.exploRover.parent).toBe(this.flaxia);
        });

        it('should allow selecting explo-rover and playing it as an upgrade, if Lifeward was used', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.useAction(this.lifeward, true);
            expect(this.lifeward.location).toBe('discard');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.clickCard(this.gub);
            expect(this.player1).not.toHavePromptButton('Play this creature');
            expect(this.player1).toHavePromptButton('Discard this card');
            this.player1.clickPrompt('Discard this card');
            this.player1.play(this.exhume);
            this.player1.clickCard(this.exploRover);
            expect(this.player1).toHavePrompt('Choose a creature to attach this upgrade to');
            this.player1.clickCard(this.flaxia);
            expect(this.exploRover.parent).toBe(this.flaxia);
        });

        xit('should allow selecting explo-rover and playing it as an upgrade, even when Quixxle Stone in play', function () {
            this.player1.play(this.gub);
            this.player1.clickCard(this.spyyyder);
            expect(this.player1).not.toHavePromptButton('Play this creature');
            expect(this.player1).toHavePromptButton('Discard this card');
            this.player1.clickPrompt('Discard this card');
            this.player1.play(this.exhume);
            this.player1.clickCard(this.exploRover);
            expect(this.player1).not.toHavePromptButton('Play this creature');
            expect(this.player1).toHavePromptButton('Play this upgrade');
            this.player1.clickPrompt('Play this upgrade');
            this.player1.clickCard(this.flaxia);
            expect(this.exploRover.parent).toBe(this.flaxia);
        });
    });
});
