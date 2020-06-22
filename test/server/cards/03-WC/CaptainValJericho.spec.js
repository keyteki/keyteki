describe('Captain Val Jericho', function () {
    describe("Captain Val Jericho's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'staralliance',
                    hand: ['armsmaster-molina', 'commander-chan', 'chuff-ape', 'flaxia'],
                    inPlay: ['captain-val-jericho']
                },
                player2: {
                    amber: 5,
                    hand: ['mother']
                }
            });
        });

        it('should not be in center when on the left of an even battle line', function () {
            expect(this.captainValJericho.isInCenter()).toBe(true);
            this.player1.play(this.commanderChan, false);
            expect(this.captainValJericho.isInCenter()).toBe(false);
        });

        it('should not be in center when on the right of an even battle line', function () {
            expect(this.captainValJericho.isInCenter()).toBe(true);
            this.player1.play(this.commanderChan, true);
            expect(this.captainValJericho.isInCenter()).toBe(false);
        });

        it('should allow playing non-staralliance only when in the middle', function () {
            expect(this.captainValJericho.isInCenter()).toBe(true);
            this.player1.clickCard(this.chuffApe);
            expect(this.player1).toHavePrompt('Play Chuff Ape:');
            this.player1.clickPrompt('Cancel');
            this.player1.play(this.commanderChan, true);
            this.player1.clickCard(this.chuffApe);
            expect(this.captainValJericho.isInCenter()).toBe(false);
            this.player1.clickCard(this.chuffApe);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.player1.play(this.armsmasterMolina, false);
            expect(this.captainValJericho.isInCenter()).toBe(true);
            this.player1.clickCard(this.chuffApe);
            expect(this.player1).toHavePrompt('Play Chuff Ape:');
            this.player1.clickPrompt('Play this creature');
        });

        it('should allow playing non-staralliance only once', function () {
            expect(this.captainValJericho.isInCenter()).toBe(true);
            this.player1.play(this.chuffApe, true);
            this.player1.play(this.commanderChan, false);
            expect(this.captainValJericho.isInCenter()).toBe(true);
            this.player1.clickCard(this.flaxia);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
