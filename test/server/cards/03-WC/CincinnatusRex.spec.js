describe('Cincinnatus Rex', function () {
    describe("Cincinnatus Rex's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['troll'],
                    hand: ['cincinnatus-rex']
                },
                player2: {
                    hand: []
                }
            });
        });

        it('should be destroyed immediately after being played if opponent has no creatures', function () {
            this.player1.play(this.cincinnatusRex);
            expect(this.cincinnatusRex.location).toBe('discard');
        });
    });

    describe("Cincinnatus Rex's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['paraguardian'],
                    hand: ['cincinnatus-rex']
                },
                player2: {
                    inPlay: ['bingle-bangbang'],
                    hand: []
                }
            });
        });

        it('should stay in play if opponent has creatures on the board', function () {
            this.player1.play(this.cincinnatusRex);
            expect(this.cincinnatusRex.location).toBe('play area');
        });

        it('should destroy itself if opponent has no creatures on the board', function () {
            this.player1.play(this.cincinnatusRex);
            expect(this.cincinnatusRex.location).toBe('play area');
            this.player1.fightWith(this.paraguardian, this.bingleBangbang);
            expect(this.bingleBangbang.location).toBe('discard');
            expect(this.cincinnatusRex.location).toBe('discard');
        });

        it('should destroy itself if opponent has no creatures on the board and its their fault', function () {
            this.player1.play(this.cincinnatusRex);
            expect(this.cincinnatusRex.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.bingleBangbang, this.cincinnatusRex);
            expect(this.bingleBangbang.location).toBe('discard');
            expect(this.cincinnatusRex.location).toBe('discard');
        });
    });

    describe("Cincinnatus Rex's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['paraguardian', 'duskwitch'],
                    hand: ['cincinnatus-rex']
                },
                player2: {
                    inPlay: ['lamindra', 'troll'],
                    hand: []
                }
            });
        });

        it('should have the option to exalt after fight and cancel', function () {
            this.player1.play(this.cincinnatusRex);
            this.player1.fightWith(this.paraguardian, this.lamindra);
            this.player1.fightWith(this.cincinnatusRex, this.lamindra);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickPrompt('Done');
            expect(this.cincinnatusRex.exhausted).toBe(true);
            expect(this.paraguardian.exhausted).toBe(true);
        });

        it('should exalt after fight and ready friendly creatures', function () {
            this.player1.play(this.cincinnatusRex);
            this.player1.fightWith(this.paraguardian, this.lamindra);
            this.player1.fightWith(this.cincinnatusRex, this.lamindra);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.cincinnatusRex);
            expect(this.cincinnatusRex.exhausted).toBe(true);
            expect(this.paraguardian.exhausted).toBe(false);
        });
    });
});
