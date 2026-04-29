describe('Delta P', function () {
    describe("Delta P's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    hand: ['delta-p', 'ember-imp', 'shooler', 'charette'],
                    inPlay: ['dew-faerie']
                },
                player2: {
                    inPlay: ['rowdy-skald', 'troll', 'krump']
                }
            });
        });

        it('should destroy creatures while opponent has more', function () {
            this.player1.play(this.deltaP);
            expect(this.player1).toBeAbleToSelect(this.rowdySkald);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.dewFaerie);
            this.player1.clickCard(this.krump);
            expect(this.krump.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.rowdySkald);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.dewFaerie);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should kill wards for free', function () {
            this.krump.ward();
            this.player1.play(this.deltaP);
            this.player1.clickCard(this.krump);
            expect(this.krump.location).toBe('play area');
            this.player1.clickCard(this.krump);
            expect(this.krump.location).toBe('discard');
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should always destroy one creature', function () {
            this.player1.playCreature(this.emberImp);
            this.player1.playCreature(this.shooler);
            this.player1.playCreature(this.charette);
            this.player1.play(this.deltaP);
            this.player1.clickCard(this.krump);
            expect(this.krump.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
