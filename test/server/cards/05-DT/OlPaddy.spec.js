describe("Ol' Paddy", function () {
    describe("Ol' Paddy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['ol--paddy'],
                    hand: [
                        'umbra',
                        'little-niff',
                        'bulleteye',
                        'foggify',
                        'data-forge',
                        'musthic-murmook',
                        'chain-gang',
                        'dust-pixie'
                    ]
                },
                player2: {
                    amber: 1,
                    inPlay: ['lamindra']
                }
            });
        });

        describe('when deck is empty', function () {
            beforeEach(function () {
                this.player1.player.deck = [];
            });

            describe('when tide is not high and reap', function () {
                beforeEach(function () {
                    this.player1.reap(this.olPaddy);
                });

                it('should not play any creature', function () {
                    expect(this.player1).isReadyToTakeAction();
                });
            });

            describe('when tide is high and reap', function () {
                beforeEach(function () {
                    this.player1.raiseTide();
                    this.player1.reap(this.olPaddy);
                });

                it('should not play any creature', function () {
                    expect(this.player1).isReadyToTakeAction();
                });
            });
        });

        describe('when deck has 1 action', function () {
            beforeEach(function () {
                this.player1.player.deck = [];
                this.player1.moveCard(this.foggify, 'deck');
            });

            describe('when tide is not high and reap', function () {
                beforeEach(function () {
                    this.player1.reap(this.olPaddy);
                });

                it('should discard 1 card', function () {
                    expect(this.foggify.location).toBe('discard');
                });

                it('should not prompt to put a card in play', function () {
                    expect(this.player1).isReadyToTakeAction();
                });
            });

            describe('when tide is high and reap', function () {
                beforeEach(function () {
                    this.player1.raiseTide();
                    this.player1.reap(this.olPaddy);
                });

                it('should discard 1 card', function () {
                    expect(this.foggify.location).toBe('discard');
                });

                it('should not prompt to put a card in play', function () {
                    expect(this.player1).isReadyToTakeAction();
                });
            });
        });

        describe('when deck has 1 creature', function () {
            beforeEach(function () {
                this.player1.player.deck = [];
                this.player1.moveCard(this.musthicMurmook, 'deck');
            });

            describe('when tide is not high and reap', function () {
                beforeEach(function () {
                    this.player1.reap(this.olPaddy);
                });

                it('should play the creature', function () {
                    this.player1.clickPrompt('Left');
                    // effect
                    this.player1.clickCard(this.lamindra);
                    expect(this.musthicMurmook.location).toBe('play area');
                    expect(this.lamindra.location).toBe('discard');
                    expect(this.player1).isReadyToTakeAction();
                });
            });

            describe('when tide is high and reap', function () {
                beforeEach(function () {
                    this.player1.raiseTide();
                    this.player1.reap(this.olPaddy);
                });

                it('should discard 1 card', function () {
                    expect(this.musthicMurmook.location).toBe('discard');
                });

                it('should play the creature', function () {
                    this.player1.clickPrompt('Left');
                    // effect
                    this.player1.clickCard(this.lamindra);
                    expect(this.lamindra.location).toBe('discard');
                    expect(this.musthicMurmook.location).toBe('play area');
                    expect(this.player1).isReadyToTakeAction();
                });
            });
        });

        describe('when deck has many cards', function () {
            beforeEach(function () {
                this.player1.player.deck = [];
                this.player1.moveCard(this.musthicMurmook, 'deck');
                this.player1.moveCard(this.foggify, 'deck');
                this.player1.moveCard(this.umbra, 'deck');
                this.player1.moveCard(this.dustPixie, 'deck');
            });

            describe('when tide is not high and reap', function () {
                beforeEach(function () {
                    this.player1.reap(this.olPaddy);
                });

                it('should the creature', function () {
                    this.player1.clickPrompt('Left');
                    // effect
                    this.player1.clickCard(this.lamindra);
                    expect(this.lamindra.location).toBe('discard');
                    expect(this.musthicMurmook.location).toBe('play area');
                    expect(this.umbra.location).toBe('deck');
                    expect(this.foggify.location).toBe('deck');
                    expect(this.dustPixie.location).toBe('deck');
                    expect(this.player1).isReadyToTakeAction();
                });
            });

            describe('when tide is high and reap', function () {
                beforeEach(function () {
                    this.player1.raiseTide();
                    this.player1.reap(this.olPaddy);
                });

                it('should play discarded creatures', function () {
                    this.player1.clickPrompt('Left');
                    this.player1.clickPrompt('Left');
                    // Musthic Murmook ability
                    this.player1.clickCard(this.lamindra);
                    expect(this.lamindra.location).toBe('discard');
                    expect(this.umbra.location).toBe('play area');
                    expect(this.musthicMurmook.location).toBe('play area');
                    expect(this.dustPixie.location).toBe('deck');
                    expect(this.foggify.location).toBe('discard');
                });
            });
        });

        describe('when deck has an omega card', function () {
            beforeEach(function () {
                this.player1.player.deck = [];
                this.player1.moveCard(this.musthicMurmook, 'deck');
                this.player1.moveCard(this.littleNiff, 'deck');
                this.player1.moveCard(this.umbra, 'deck');
                this.player1.moveCard(this.dustPixie, 'deck');
            });

            describe('when tide is high and reap', function () {
                beforeEach(function () {
                    this.player1.raiseTide();
                    this.player1.reap(this.olPaddy);
                });

                it('should play all 3 creatures, and finish turn after the last one', function () {
                    this.player1.clickPrompt('Left');
                    this.player1.clickPrompt('Deploy Left');
                    this.player1.clickCard(this.umbra);
                    this.player1.clickPrompt('Left');
                    // Musthic Murmook ability
                    this.player1.clickCard(this.lamindra);
                    expect(this.lamindra.location).toBe('discard');
                    expect(this.littleNiff.location).toBe('play area');
                    expect(this.umbra.location).toBe('play area');
                    expect(this.musthicMurmook.location).toBe('play area');
                    expect(this.player2).toHavePrompt(
                        'Choose which house you want to activate this turn'
                    );
                });
            });
        });
    });
});
