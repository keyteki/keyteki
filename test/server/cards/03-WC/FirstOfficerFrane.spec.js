describe('First Officer Frane', function () {
    describe("First Officer Frane's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['first-officer-frane'],
                    inPlay: ['lieutenant-khrkhar']
                },
                player2: {
                    inPlay: ['dust-pixie'],
                    amber: 2
                }
            });
        });

        it('should allow a friendly creature to capture 1 amber when it is played', function () {
            this.player1.play(this.firstOfficerFrane);
            expect(this.player1).toHavePrompt('First Officer Frane');
            expect(this.player1).toBeAbleToSelect(this.firstOfficerFrane);
            expect(this.player1).toBeAbleToSelect(this.lieutenantKhrkhar);
            this.player1.clickCard(this.firstOfficerFrane);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.firstOfficerFrane.tokens.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not capture an amber when the opponent has 0', function () {
            this.player2.amber = 0;
            this.player1.play(this.firstOfficerFrane);
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(0);
            expect(this.firstOfficerFrane.tokens.amber).toBe(undefined);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
    describe("First Officer Frane's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['first-officer-frane', 'lieutenant-khrkhar']
                },
                player2: {
                    inPlay: ['dust-pixie'],
                    amber: 2
                }
            });
        });
        it('should allow a friendly creature to capture 1 amber when it reaps', function () {
            this.player1.reap(this.firstOfficerFrane);
            expect(this.player1).toHavePrompt('First Officer Frane');
            expect(this.player1).toBeAbleToSelect(this.firstOfficerFrane);
            expect(this.player1).toBeAbleToSelect(this.lieutenantKhrkhar);
            this.player1.clickCard(this.firstOfficerFrane);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.firstOfficerFrane.tokens.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
        it('should allow a friendly creature to capture 1 amber when it fights', function () {
            this.player1.fightWith(this.firstOfficerFrane, this.dustPixie);
            expect(this.player1).toHavePrompt('First Officer Frane');
            expect(this.player1).toBeAbleToSelect(this.firstOfficerFrane);
            expect(this.player1).toBeAbleToSelect(this.lieutenantKhrkhar);
            this.player1.clickCard(this.firstOfficerFrane);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.firstOfficerFrane.tokens.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
