describe('Sniffer', function () {
    describe("Sniffer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['sniffer', 'zorg', 'mindwarper']
                },
                player2: {
                    inPlay: ['urchin']
                }
            });
        });
        it('should remove elusive from all creatures for the turn', function () {
            expect(this.zorg.getKeywordValue('elusive')).toBe(0);
            expect(this.mindwarper.getKeywordValue('elusive')).toBe(1);
            expect(this.urchin.getKeywordValue('elusive')).toBe(1);
            this.player1.useAction(this.sniffer);
            expect(this.zorg.getKeywordValue('elusive')).toBe(0);
            expect(this.mindwarper.getKeywordValue('elusive')).toBe(0);
            expect(this.urchin.getKeywordValue('elusive')).toBe(0);
            this.player1.endTurn();
            expect(this.zorg.getKeywordValue('elusive')).toBe(0);
            expect(this.mindwarper.getKeywordValue('elusive')).toBe(1);
            expect(this.urchin.getKeywordValue('elusive')).toBe(1);
            this.player2.clickPrompt('shadows');
            expect(this.zorg.getKeywordValue('elusive')).toBe(0);
            expect(this.mindwarper.getKeywordValue('elusive')).toBe(1);
            expect(this.urchin.getKeywordValue('elusive')).toBe(1);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
