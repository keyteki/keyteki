describe('Northern Refugee', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('greyjoy', [
                'A Storm of Swords', 'Winter Festival',
                'Northern Refugee'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();
            this.completeSetup();
        });

        describe('when there is no Winter plot out', function() {
            beforeEach(function() {
                this.player1.selectPlot('A Storm of Swords');
                this.player2.selectPlot('A Storm of Swords');
                this.selectFirstPlayer(this.player1);

                this.player1.clickCard('Northern Refugee', 'hand');
            });

            it('should cost 2 gold to marshal', function() {
                expect(this.player1Object.gold).toBe(1);
            });
        });

        describe('when there is a Winter plot out', function() {
            beforeEach(function() {
                this.player1.selectPlot('A Storm of Swords');
                this.player2.selectPlot('Winter Festival');
                this.selectFirstPlayer(this.player1);

                this.player1.clickCard('Northern Refugee', 'hand');
            });

            it('should cost 1 gold to marshal', function() {
                expect(this.player1Object.gold).toBe(2);
            });
        });
    });
});
