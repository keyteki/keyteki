describe('Dance of Doom', function () {
    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'dis',
                    hand: ['dance-of-doom'],
                    inPlay: ['haedroth-s-wall', 'gargantodon', 'lion-bautrem', 'shooler']
                },
                player2: {
                    amber: 5,
                    inPlay: ['batdrone', 'dextre', 'lamindra', 'plague-rat', 'mooncurser']
                }
            });

            this.player1.play(this.danceOfDoom);
        });

        it('should prompt for a number', function () {
            expect(this.player1).toHavePrompt('Choose a number');
        });

        describe("and an option is selected equal to a creature's power", function () {
            beforeEach(function () {
                this.player1.selectOption(1);
            });

            it('it should destroy all creatures of that power', function () {
                expect(this.gargantodon.location).toBe('play area');
                expect(this.lionBautrem.location).toBe('play area');
                expect(this.shooler.location).toBe('play area');
                expect(this.batdrone.location).toBe('play area');
                expect(this.dextre.location).toBe('play area');
                expect(this.lamindra.location).toBe('discard');
                expect(this.plagueRat.location).toBe('discard');
                expect(this.mooncurser.location).toBe('discard');
            });
        });

        describe("and an option is selected equal to a creature's modified power", function () {
            beforeEach(function () {
                this.player1.selectOption(20);
            });

            it('it should destroy all creatures of that power', function () {
                expect(this.gargantodon.location).toBe('discard');
                expect(this.lionBautrem.location).toBe('play area');
                expect(this.shooler.location).toBe('play area');
                expect(this.batdrone.location).toBe('play area');
                expect(this.dextre.location).toBe('play area');
                expect(this.lamindra.location).toBe('play area');
                expect(this.plagueRat.location).toBe('play area');
                expect(this.mooncurser.location).toBe('play area');
            });
        });

        describe("and an option is selected different from all creature's power", function () {
            beforeEach(function () {
                this.player1.selectOption(0);
            });

            it('it should not destroy any creature', function () {
                expect(this.gargantodon.location).toBe('play area');
                expect(this.lionBautrem.location).toBe('play area');
                expect(this.shooler.location).toBe('play area');
                expect(this.batdrone.location).toBe('play area');
                expect(this.dextre.location).toBe('play area');
                expect(this.lamindra.location).toBe('play area');
                expect(this.plagueRat.location).toBe('play area');
                expect(this.mooncurser.location).toBe('play area');
            });
        });
    });

    describe('when played and there is no creature in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['dance-of-doom']
                },
                player2: {}
            });

            this.player1.play(this.danceOfDoom);
        });

        it('should prompt for 0 only', function () {
            expect(this.player1).toHavePrompt('Choose a number');
            this.player1.selectOption(0);
        });
    });
});
