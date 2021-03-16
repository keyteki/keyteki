describe('Venator Altum', function () {
    describe('when the tide is neutral', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['galeatops'],
                    hand: ['stomp', 'beware-the-ides']
                },
                player2: {
                    inPlay: ['venator-altum']
                }
            });
        });

        it('should not exalt when damage is dealt to it', function () {
            this.player1.play(this.stomp);
            this.player1.clickCard(this.venatorAltum);
            expect(this.venatorAltum.amber).toBe(0);
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('should not exalt when damage is dealt to it', function () {
                this.player1.fightWith(this.galeatops, this.venatorAltum);
                expect(this.venatorAltum.amber).toBe(0);
            });
        });

        describe('when the tide is lower', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should exalt when damage is dealt to it', function () {
                this.player1.fightWith(this.galeatops, this.venatorAltum);
                expect(this.venatorAltum.amber).toBe(1);
            });

            it('should not exalt when damage is dealt to it and it is destroyed', function () {
                this.player1.play(this.bewareTheIdes);
                this.player1.clickCard(this.venatorAltum);
                expect(this.venatorAltum.location).toBe('discard');
                expect(this.player1.amber).toBe(1);
            });
        });
    });
});
