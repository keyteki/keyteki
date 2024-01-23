describe('Cincinnatus Resurrexit', function () {
    describe("Cincinnatus Resurrexit's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'saurian',
                    hand: ['recruit', 'cincinnatus-resurrexit'],
                    discard: new Array(9).fill('poke')
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll', 'thing-from-the-deep']
                }
            });
            this.player1.chains = 36;
            this.player1.playCreature(this.cincinnatusResurrexit);
        });

        it('captures 2 and exalts on play', function () {
            expect(this.cincinnatusResurrexit.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('gains power for each amber on it', function () {
            expect(this.cincinnatusResurrexit.power).toBe(9);
        });

        describe('after play', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('brobnar');
                this.player2.endTurn();
                this.player1.clickPrompt('saurian');
            });

            it('captures 2 and exalts on fight', function () {
                this.player1.fightWith(this.cincinnatusResurrexit, this.troll);
                expect(this.cincinnatusResurrexit.amber).toBe(6);
                expect(this.player2.amber).toBe(1);
                expect(this.cincinnatusResurrexit.power).toBe(12);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });

            it('does not archive on destroy if not haunted', function () {
                this.player1.fightWith(this.cincinnatusResurrexit, this.thingFromTheDeep);
                expect(this.cincinnatusResurrexit.location).toBe('discard');
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });

            it('archives on destroy if haunted', function () {
                this.player1.play(this.recruit);
                this.player1.fightWith(this.cincinnatusResurrexit, this.thingFromTheDeep);
                expect(this.cincinnatusResurrexit.location).toBe('archives');
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
