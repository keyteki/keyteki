describe('Infiltrator', function () {
    describe("Infiltrator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['infiltrator'],
                    inPlay: ['flaxia']
                },
                player2: {
                    hand: ['gub'],
                    inPlay: ['charette', 'cpo-zytar']
                }
            });
            this.player1.playCreature(this.infiltrator);
            this.infiltrator.exhausted = false;
        });

        it('enters play under opponent control', function () {
            expect(this.player2.player.creaturesInPlay).toContain(this.infiltrator);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can be used with any house', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.reap(this.infiltrator);
            expect(this.player2).isReadyToTakeAction();
        });

        it('has skirmish', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.fightWith(this.infiltrator, this.flaxia);
            expect(this.infiltrator.tokens.damage).toBe(undefined);
            expect(this.flaxia.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('destroys its neighbors at the end of the turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.playCreature(this.gub);
            this.player2.endTurn();
            expect(this.cpoZytar.location).toBe('discard');
            expect(this.gub.location).toBe('discard');
            expect(this.infiltrator.location).toBe('play area');
            expect(this.charette.location).toBe('play area');
            this.player1.clickPrompt('geistoid');
        });
    });
});
