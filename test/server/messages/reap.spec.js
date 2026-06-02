describe('Reap Messages', function () {
    describe('reap', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['ganger-chieftain']
                },
                player2: {}
            });
        });

        it('should log correct message when reaping', function () {
            this.player1.reap(this.gangerChieftain);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Ganger Chieftain to reap with Ganger Chieftain'
            ]);
        });
    });

    describe('Fading Apparition amber redirect', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['fading-apparition', 'boiler', 'jahneerie']
                },
                player2: {}
            });
            this.fadingApparition.exhaust();
            this.boiler.amber = 1;
        });

        it('should log correct message when redirecting amber from a creature', function () {
            this.player1.reap(this.jahneerie);
            this.player1.clickCard(this.boiler);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Jahneerie to reap with Jahneerie',
                'player1 uses Fading Apparition to take 1 amber from Boiler instead of the common supply'
            ]);
        });
    });
});
