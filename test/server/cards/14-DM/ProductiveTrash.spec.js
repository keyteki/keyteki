describe('Productive Trash', function () {
    describe('non-Mars discard with bonus icons', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['productive-trash', 'urchin'],
                    inPlay: ['john-smyth', 'iyxrenu-the-clever']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll']
                }
            });
            // urchin has 2 amber bonus icons
            this.urchin.enhancements = ['amber', 'amber'];
        });

        it('captures 1 per bonus icon on the discarded card from the opponent', function () {
            this.player1.play(this.productiveTrash);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.johnSmyth);
            expect(this.johnSmyth.amber).toBe(this.urchin.bonusIcons.length);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(5 - this.urchin.bonusIcons.length);
            expect(this.player1).isReadyToTakeAction();
        });

        it('may decline to discard', function () {
            this.player1.play(this.productiveTrash);
            this.player1.clickPrompt('Done');
            expect(this.urchin.location).toBe('hand');
            expect(this.johnSmyth.amber).toBe(0);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('counts other bonus icon types', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['productive-trash', 'brillix-ponder'],
                    inPlay: ['john-smyth']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll']
                }
            });
        });

        it('counts draw, discard, capture and power bonus icons', function () {
            this.brillixPonder.enhancements = ['draw', 'discard', 'capture', 'power'];
            this.player1.play(this.productiveTrash);
            this.player1.clickCard(this.brillixPonder);
            expect(this.brillixPonder.location).toBe('discard');
            this.player1.clickCard(this.johnSmyth);
            // 4 non-amber bonus icons → 4 amber captured from opponent
            expect(this.johnSmyth.amber).toBe(4);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('counts house bonus icons', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['productive-trash', 'brillix-ponder'],
                    inPlay: ['john-smyth']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll']
                }
            });
        });

        it('counts house bonus icons (brobnar, sanctum) as bonus icons', function () {
            this.brillixPonder.enhancements = ['brobnar', 'sanctum'];
            this.player1.play(this.productiveTrash);
            this.player1.clickCard(this.brillixPonder);
            this.player1.clickCard(this.johnSmyth);
            expect(this.johnSmyth.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
