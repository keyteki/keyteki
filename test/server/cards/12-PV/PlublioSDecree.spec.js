describe("Plublio's Decree", function () {
    describe("Plublio's Decree's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    hand: ['plublio-s-decree'],
                    inPlay: ['raiding-knight', 'almsmaster', 'ember-imp']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump']
                }
            });
        });

        it('should exalt and change house of up to 3 friendly creatures', function () {
            this.player1.play(this.plublioSDecree);
            expect(this.player1).toBeAbleToSelect(this.raidingKnight);
            expect(this.player1).toBeAbleToSelect(this.almsmaster);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.raidingKnight);
            this.player1.clickCard(this.almsmaster);
            this.player1.clickCard(this.emberImp);
            this.player1.clickPrompt('Done');
            expect(this.raidingKnight.tokens.amber).toBe(1);
            expect(this.almsmaster.tokens.amber).toBe(1);
            expect(this.emberImp.tokens.amber).toBe(1);
            this.player1.reap(this.raidingKnight);
            this.player1.reap(this.almsmaster);
            this.player1.reap(this.emberImp);
            expect(this.player1.amber).toBe(8);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should exalt and change house of less than 3 friendly creatures', function () {
            this.player1.play(this.plublioSDecree);
            this.player1.clickCard(this.raidingKnight);
            this.player1.clickPrompt('Done');
            expect(this.raidingKnight.tokens.amber).toBe(1);
            expect(this.almsmaster.tokens.amber).toBeUndefined();
            expect(this.emberImp.tokens.amber).toBeUndefined();
            this.player1.reap(this.raidingKnight);
            this.player1.clickCard(this.emberImp);
            expect(this.player1.amber).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not require selecting any creatures', function () {
            this.player1.play(this.plublioSDecree);
            this.player1.clickPrompt('Done');
            expect(this.raidingKnight.tokens.amber).toBeUndefined();
            expect(this.almsmaster.tokens.amber).toBeUndefined();
            expect(this.emberImp.tokens.amber).toBeUndefined();
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
