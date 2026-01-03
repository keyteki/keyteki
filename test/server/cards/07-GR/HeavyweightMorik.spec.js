describe('Heavyweight Morik', function () {
    describe("Heavyweight Morik's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['heavyweight-morik'],
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['old-bruno', 'flaxia', 'dust-pixie']
                }
            });
        });

        it('has splash-attack 2', function () {
            this.player1.playCreature(this.heavyweightMorik);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.fightWith(this.heavyweightMorik, this.flaxia);
            expect(this.oldBruno.tokens.damage).toBe(2);
            expect(this.flaxia.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
        });

        it('can deal damage on scrap', function () {
            this.player1.scrap(this.heavyweightMorik);
            expect(this.player1).toBeAbleToSelect(this.oldBruno);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.heavyweightMorik);
            this.player1.clickCard(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.oldBruno);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.heavyweightMorik);
            this.player1.clickCard(this.troll);
            expect(this.flaxia.tokens.damage).toBe(2);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.oldBruno.tokens.damage).toBe(undefined);
            expect(this.dustPixie.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
