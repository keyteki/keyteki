const _ = require('underscore');

xdescribe('setup phase', function() {
    integration(function() {
        describe('setting up provinces', function() {
            beforeEach(function() {
                const deck = this.buildDeck('phoenix', [
                    'isawa-mori-seido',
                    'fertile-fields','fertile-fields','fertile-fields','fertile-fields','fertile-fields',
                    'otomo-courtier','otomo-courtier','otomo-courtier','otomo-courtier','otomo-courtier'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();

                this.nextProvinceCard = () => {
                    return this.player1.player.provinceDeck.value()[0];
                };
            });

            it('should start with no cards in hand or on provinces', function() {
                const locations = [
                    'hand',
                    'provinceOne',
                    'provinceTwo',
                    'provinceThree',
                    'provinceFour',
                    'strongholdProvince'
                ];
                _.each(locations, loc => expect(this.player1.player[loc].value().length).toBe(0));
            });

            it('should present both players with a prompt to set up provinces', function() {
                expect(this.player1.currentPrompt().menuTitle).toBe('Select stronghold province');
                expect(this.player2.currentPrompt().menuTitle).toBe('Select stronghold province');
            });

            it('should allow proceeding once all provinces have been set up', function() {
                let strongholdProvince = this.nextProvinceCard();
                strongholdProvince.selected = true;
                this.player1.clickPrompt('Done');
                expect(this.player1.currentPrompt().menuTitle).toBe('Waiting for opponent to finish selecting a stronghold province');
            });

        });

    });
});
