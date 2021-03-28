describe('Fangtooth Cavern', function () {
    describe("Fangtooth Cavern's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['fangtooth-cavern', 'dust-pixie', 'dextre']
                },
                player2: {
                    inPlay: ['dust-imp', 'mighty-tiger']
                }
            });
        });

        it('should destroy the least powerful creature at the end of p1 turn', function () {
            this.player1.endTurn();
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.dustImp);
            expect(this.player1).not.toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            expect(this.dustImp.location).toBe('play area');
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            expect(this.player1).toBeAbleToSelect(this.dustImp);
            expect(this.player1).not.toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.dustImp);
            expect(this.dustImp.location).toBe('discard');
        });
    });
    describe("Fangtooth Cavern's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['fangtooth-cavern', 'dextre']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'tocsin']
                }
            });
        });

        it('should prompt for player choice when there are two equal power creatures in play', function () {
            this.player1.endTurn();
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.tocsin);
            expect(this.player1).not.toBeAbleToSelect(this.mightyTiger);
            this.player1.clickCard(this.tocsin);
            expect(this.tocsin.location).toBe('discard');
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            expect(this.dextre.location).toBe('play area');
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.mightyTiger);
            this.player1.clickCard(this.dextre);
            expect(this.dextre.location).toBe('deck');
        });
    });
});
