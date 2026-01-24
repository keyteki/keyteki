describe('Nautilixian', function () {
    describe("Nautilixian's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: [
                        'nautilixian',
                        'green-aeronaut',
                        'white-aeronaut',
                        'red-aeronaut',
                        'purple-aeronaut',
                        'tunk'
                    ]
                },
                player2: {
                    amber: 3,
                    hand: ['draining-touch'],
                    inPlay: ['tocsin', 'ember-imp', 'shooler']
                }
            });
        });

        it('cannot be used until Mars creature has been used', function () {
            this.player1.clickCard(this.nautilixian);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            this.player1.reap(this.tunk);
            this.player1.reap(this.nautilixian);
        });

        it('make pilot creatures invulnerable', function () {
            this.player1.fightWith(this.greenAeronaut, this.emberImp);
            expect(this.greenAeronaut.damage).toBe(0);
            expect(this.greenAeronaut.location).toBe('play area');
            expect(this.emberImp.location).toBe('discard');
            this.player1.fightWith(this.whiteAeronaut, this.tocsin);
            expect(this.whiteAeronaut.damage).toBe(0);
            expect(this.whiteAeronaut.location).toBe('play area');
            expect(this.tocsin.location).toBe('discard');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.drainingTouch);
            this.player2.clickCard(this.redAeronaut);
            expect(this.redAeronaut.location).toBe('play area');
        });

        it('does not make non-pilot creatures invulnerable', function () {
            this.player1.fightWith(this.tunk, this.shooler);
            expect(this.tunk.damage).toBe(4);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.drainingTouch);
            this.player2.clickCard(this.tunk);
            expect(this.tunk.location).toBe('discard');
        });
    });
});
