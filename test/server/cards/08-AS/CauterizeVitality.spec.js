describe('Cauterize Vitality', function () {
    describe("Cauterize Vitality's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    hand: ['cauterize-vitality'],
                    inPlay: ['shooler', 'wretched-doll']
                },
                player2: {
                    amber: 4,
                    inPlay: ['dust-pixie', 'niffle-grounds']
                }
            });

            this.wretchedDoll.enhancements = ['capture'];
            this.niffleGrounds.enhancements = ['draw'];
            this.player1.play(this.cauterizeVitality);
        });

        it('should destroy a creature', function () {
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.wretchedDoll);
            expect(this.player1).toBeAbleToSelect(this.niffleGrounds);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should destroy an artifact', function () {
            this.player1.clickCard(this.niffleGrounds);
            expect(this.niffleGrounds.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should cause opponent to lose amber for bonus amber', function () {
            this.player1.clickCard(this.dustPixie);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should cause opponent to lose amber for other bonus icons', function () {
            this.player1.clickCard(this.niffleGrounds);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should cause opponent to lose amber for friendly destruction', function () {
            this.player1.clickCard(this.wretchedDoll);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
