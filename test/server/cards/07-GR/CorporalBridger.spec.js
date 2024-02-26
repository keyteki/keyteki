describe('Corporal Bridger', function () {
    describe("Corporal Bridger's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['corporal-bridger', 'batdrone'],
                    inPlay: ['dust-pixie', 'flaxia', 'library-of-babble']
                },
                player2: {
                    inPlay: ['timetraveller']
                }
            });
        });

        it('should allow creature use on play', function () {
            this.player1.play(this.corporalBridger);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1).not.toBeAbleToPlay(this.batdrone);
            this.player1.reap(this.dustPixie);
            expect(this.player1.amber).toBe(2);
            this.player1.clickCard(this.flaxia);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not allow artifact use on play', function () {
            this.player1.play(this.corporalBridger);
            this.player1.clickCard(this.libraryOfBabble);
            expect(this.player1.hand.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow creature use on reap', function () {
            this.player1.play(this.corporalBridger);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.reap(this.corporalBridger);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1).not.toBeAbleToPlay(this.batdrone);
            this.player1.reap(this.flaxia);
            expect(this.player1.amber).toBe(3);
            this.player1.clickCard(this.dustPixie);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow creature use on fight', function () {
            this.player1.play(this.corporalBridger);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.fightWith(this.corporalBridger, this.timetraveller);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1).not.toBeAbleToPlay(this.batdrone);
            this.player1.reap(this.flaxia);
            expect(this.player1.amber).toBe(2);
            this.player1.clickCard(this.dustPixie);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
