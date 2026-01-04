describe('A Gift of Amber', function () {
    describe("A Gift of Amber's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    hand: ['a-gift-of-æmber'],
                    inPlay: ['ember-imp', 'dust-imp']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll', 'charette', 'krump']
                }
            });

            this.player1.play(this.aGiftOfÆmber);
        });

        it('should be able to destroy two friendly creatures', function () {
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.dustImp);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.dustImp);
            this.player1.clickCard(this.emberImp);
            this.player1.clickPrompt('Done');
            expect(this.dustImp.location).toBe('discard');
            expect(this.emberImp.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.charette.location).toBe('play area');
            expect(this.krump.location).toBe('play area');
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be able to destroy two enemy creatures', function () {
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.charette);
            this.player1.clickPrompt('Done');
            expect(this.dustImp.location).toBe('play area');
            expect(this.emberImp.location).toBe('play area');
            expect(this.troll.location).toBe('discard');
            expect(this.charette.location).toBe('discard');
            expect(this.krump.location).toBe('play area');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be able to destroy one friendly and one enemy creatures', function () {
            this.player1.clickCard(this.emberImp);
            this.player1.clickCard(this.charette);
            this.player1.clickPrompt('Done');
            expect(this.dustImp.location).toBe('play area');
            expect(this.emberImp.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.charette.location).toBe('discard');
            expect(this.krump.location).toBe('play area');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be able to destroy one creature', function () {
            this.player1.clickCard(this.charette);
            this.player1.clickPrompt('Done');
            expect(this.dustImp.location).toBe('play area');
            expect(this.emberImp.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.charette.location).toBe('discard');
            expect(this.krump.location).toBe('play area');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be able to destroy no creatures', function () {
            this.player1.clickPrompt('Done');
            expect(this.dustImp.location).toBe('play area');
            expect(this.emberImp.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.charette.location).toBe('play area');
            expect(this.krump.location).toBe('play area');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
