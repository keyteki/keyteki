const _ = require('underscore');

describe('setup phase', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('phoenix', [
                'isawa-mori-seido',
                'entrenched-position','fertile-fields','shameful-display','elemental-fury', 'meditations-on-the-tao',
                'otomo-courtier','otomo-courtier','otomo-courtier','otomo-courtier','otomo-courtier',
                'banzai', 'banzai', 'banzai', 'banzai', 'banzai'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
        });

        describe('choosing first player', function() {
            beforeEach(function() {
                [this.firstPlayer, this.secondPlayer] = _.sortBy(this.flow.allPlayers, player => !player.firstPlayer);
            });

            it('should prompt first player with \'Choose First Player\' prompt', function() {
                expect(this.firstPlayer).toHavePrompt('You won the flip. Do you want to be:');
            });

            it('should prompt second player with correct waiting prompt', function() {
                expect(this.secondPlayer).toHavePrompt('Waiting for opponent to use Choose First Player');
            });
        });
    
        describe('setting up provinces', function() {
            beforeEach(function() {
                this.selectFirstPlayer(this.player1);
            });

            it('should give 1 fate to second player', function() {
                expect(this.player2.player.fate).toBe(1);
            });

            it('should start with no cards in hand or on provinces', function() {
                const locations = [
                    'hand',
                    'provinceOne',
                    'provinceTwo',
                    'provinceThree',
                    'provinceFour'
                ];
                _.each(locations, loc => expect(this.player1.player[loc].value().length).toBe(0));
            });

            it('should start with stronghold in stronghold province', function() {
                expect(this.player1.player.strongholdProvince.value().length).toBe(1);
                expect(this.player1.player.strongholdProvince.first().isStronghold).toBe(true);
                expect(this.player2.player.strongholdProvince.value().length).toBe(1);
                expect(this.player2.player.strongholdProvince.first().isStronghold).toBe(true);                
            });

            it('should present both players with a prompt to set up provinces', function() {
                expect(this.player1.currentPrompt().menuTitle).toBe('Select stronghold province');
                expect(this.player2.currentPrompt().menuTitle).toBe('Select stronghold province');
            });

            it('should allow proceeding once all provinces have been set up', function() {
                let strongholdProvince = this.player1.player.provinceDeck.value()[0];
                strongholdProvince.selected = true;
                this.player1.clickPrompt('Done');
                expect(this.player1.currentPrompt().menuTitle).toBe('Waiting for opponent to finish selecting a stronghold province');
            });
        });

        describe('dynasty mulligans', function() {
            beforeEach(function() {
                this.selectFirstPlayer(this.player1);
                this.selectProvinces();
                this.spy = spyOn(this.player1.player, 'shuffleDynastyDeck');
            });

            it('should present first player with a dynasty mulligan prompt', function() {
                expect(this.player1).toHavePrompt('Select dynasty cards to mulligan');
                expect(this.player2).toHavePrompt('Waiting for opponent to mulligan dynasty cards');
            });

            describe('if the player clicks Done', function() {
                beforeEach(function() {
                    this.player1.clickPrompt('Done');
                });

                it('should prompt the second player', function() {
                    expect(this.player2).toHavePrompt('Select dynasty cards to mulligan');
                    expect(this.player1).toHavePrompt('Waiting for opponent to mulligan dynasty cards');
                });

                it('should not shuffle the dynasty deck', function() {
                    expect(this.spy).not.toHaveBeenCalled();
                });
            });

            describe('if the player chooses to mulligan a card', function() {
                beforeEach(function() {
                    this.oldCard = this.player1.findCardByName('Otomo Courtier', 'province 1');
                    this.newCard = this.player1.player.dynastyDeck.first();
                    this.player1.clickCard(this.oldCard);
                    this.player1.clickPrompt('Done');
                });

                it('should move the old card to the deck', function() {
                    expect(this.oldCard.location).toBe('dynasty deck');
                });

                it('should move the new card to province 1', function() {
                    expect(this.newCard.location).toBe('province 1');
                });

                it('should shuffle the dynasty deck', function() {
                    expect(this.spy).toHaveBeenCalled();
                });
            });
        });

        describe('conflict mulligan', function() {
            beforeEach(function() {
                this.selectFirstPlayer(this.player1);
                this.selectProvinces();
                this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
                this.spy = spyOn(this.player1.player, 'shuffleConflictDeck');
            });

            it('should present first player with a conflict mulligan prompt', function() {
                expect(this.player1).toHavePrompt('Select conflict cards to mulligan');
                expect(this.player2).toHavePrompt('Waiting for opponent to mulligan conflict cards');
            });

            describe('if the player clicks Done', function() {
                beforeEach(function() {
                    this.player1.clickPrompt('Done');
                });

                it('should prompt the second player', function() {
                    expect(this.player2).toHavePrompt('Select conflict cards to mulligan');
                    expect(this.player1).toHavePrompt('Waiting for opponent to mulligan conflict cards');
                });

                it('should not shuffle the conflict deck', function() {
                    expect(this.spy).not.toHaveBeenCalled();
                });
            });

            describe('if the player chooses to mulligan a card', function() {
                beforeEach(function() {
                    this.oldCard = this.player1.findCardByName('Banzai!', 'hand');
                    this.newCard = this.player1.player.conflictDeck.first();
                    this.player1.clickCard(this.oldCard);
                    this.player1.clickPrompt('Done');
                });

                it('should move the old card to the deck', function() {
                    expect(this.oldCard.location).toBe('conflict deck');
                });

                it('should move the new card to hand', function() {
                    expect(this.newCard.location).toBe('hand');
                });

                it('should shuffle the conflict deck', function() {
                    expect(this.spy).toHaveBeenCalled();
                });
            });

            describe('if both player click Done', function() {
                it('should go to the dynasty phase', function() {
                    this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
                    expect(this.game.currentPhase).toBe('dynasty');
                });
            });
        });
    });
});
