describe('Waste Not', function () {
    describe("Waste Not's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['waste-not'],
                    inPlay: ['flaxia', 'gub', 'urchin', 'gebuk']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump']
                }
            });
        });

        it('should only target friendly cards', function () {
            this.player1.play(this.wasteNot);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
        });

        it('should destroy 4 power creature and 2 draw cards', function () {
            this.player1.play(this.wasteNot);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.krump);

            expect(this.player1.hand.length).toBe(0);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.location).toBe('discard');
            expect(this.urchin.location).toBe('play area');
            expect(this.gub.location).toBe('play area');
            expect(this.player1.hand.length).toBe(2);
        });

        it('should remove a 4 power creature ward and still 2 draw cards', function () {
            this.flaxia.ward();
            this.player1.play(this.wasteNot);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.krump);

            expect(this.player1.hand.length).toBe(0);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.location).toBe('play area');
            expect(this.flaxia.warded).toBe(false);
            expect(this.urchin.location).toBe('play area');
            expect(this.gub.location).toBe('play area');
            expect(this.player1.hand.length).toBe(2);
        });

        it('should destroy 1 power creature and 1 draw cards', function () {
            this.player1.play(this.wasteNot);
            expect(this.player1.hand.length).toBe(0);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.flaxia.location).toBe('play area');
            expect(this.gub.location).toBe('play area');
            expect(this.player1.hand.length).toBe(1);
        });

        it('should destroy gub with flanks and draw 3 cards', function () {
            this.player1.play(this.wasteNot);
            expect(this.player1.hand.length).toBe(0);
            this.player1.clickCard(this.gub);
            expect(this.gub.location).toBe('discard');
            expect(this.urchin.location).toBe('play area');
            expect(this.flaxia.location).toBe('play area');
            expect(this.player1.hand.length).toBe(3);
        });

        it('should be interrupted by destroyed effects ', function () {
            this.player1.moveCard(this.urchin, 'deck');
            expect(this.urchin.location).toBe('deck');
            this.player1.play(this.wasteNot);
            this.player1.clickCard(this.gebuk);
            expect(this.urchin.location).toBe('play area');
            expect(this.gebuk.location).toBe('discard');
            expect(this.player1.hand.length).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
