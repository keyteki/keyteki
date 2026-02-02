describe('Fiendish Apprentice', function () {
    describe("Fiendish Apprentice's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    inPlay: ['ember-imp', 'dew-faerie', 'dust-pixie', 'shooler'],
                    hand: ['fiendish-apprentice']
                },
                player2: {
                    inPlay: ['rowdy-skald', 'troll', 'charette']
                }
            });
        });

        it('should deal 3 damage to enemy creatures for each friendly dis creature', function () {
            this.player1.play(this.fiendishApprentice);
            expect(this.player1).toBeAbleToSelect(this.rowdySkald);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.dewFaerie);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            this.player1.clickCard(this.rowdySkald);
            this.player1.clickCard(this.charette);
            expect(this.rowdySkald.damage).toBe(3);
            expect(this.charette.damage).toBe(3);
            expect(this.troll.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow selecting the same creature multiple times', function () {
            this.player1.play(this.fiendishApprentice);
            this.player1.clickCard(this.rowdySkald);
            this.player1.clickCard(this.rowdySkald);
            expect(this.rowdySkald.location).toBe('discard');
            expect(this.charette.damage).toBe(0);
            expect(this.troll.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should count house enhancements', function () {
            this.dewFaerie.enhancements = ['dis'];
            this.player1.play(this.fiendishApprentice);
            expect(this.player1).toBeAbleToSelect(this.rowdySkald);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.dewFaerie);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            this.player1.clickCard(this.rowdySkald);
            this.player1.clickCard(this.charette);
            this.player1.clickCard(this.troll);
            expect(this.rowdySkald.damage).toBe(3);
            expect(this.charette.damage).toBe(3);
            expect(this.troll.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
