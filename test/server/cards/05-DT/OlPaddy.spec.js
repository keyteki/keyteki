describe("Ol' Paddy", function () {
    describe("Ol' Paddy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['ol--paddy'],
                    hand: [
                        'umbra',
                        'bulleteye',
                        'foggify',
                        'data-forge',
                        'murmook',
                        'chain-gang',
                        'dust-pixie'
                    ]
                },
                player2: {
                    amber: 1
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

                it('should not prompt to put a card in play', function () {
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                });
            });

            describe('when tide is high and reap', function () {
                beforeEach(function () {
                    this.player1.raiseTide();
                    this.player1.reap(this.olPaddy);
                });

                it('should not prompt to put a card in play', function () {
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
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
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
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
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                });
            });
        });

        describe('when deck has 1 creature', function () {
            beforeEach(function () {
                this.player1.player.deck = [];
                this.player1.moveCard(this.dustPixie, 'deck');
            });

            describe('when tide is not high and reap', function () {
                beforeEach(function () {
                    this.player1.reap(this.olPaddy);
                });

                it('should discard 1 card', function () {
                    expect(this.dustPixie.location).toBe('discard');
                });

                it('should prompt to put the creature in play', function () {
                    expect(this.player1).toBeAbleToSelect(this.dustPixie);
                    this.player1.clickCard(this.dustPixie);
                    this.player1.clickPrompt('Left');
                    expect(this.dustPixie.location).toBe('play area');
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                });
            });

            describe('when tide is high and reap', function () {
                beforeEach(function () {
                    this.player1.raiseTide();
                    this.player1.reap(this.olPaddy);
                });

                it('should discard 1 card', function () {
                    expect(this.dustPixie.location).toBe('discard');
                });

                it('should prompt to put the creature in play', function () {
                    expect(this.player1).toBeAbleToSelect(this.dustPixie);
                    this.player1.clickCard(this.dustPixie);
                    this.player1.clickPrompt('Left');
                    expect(this.dustPixie.location).toBe('play area');
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                });
            });
        });

        describe('when deck has many cards', function () {
            beforeEach(function () {
                this.player1.player.deck = [];
                this.player1.moveCard(this.umbra, 'deck');
                this.player1.moveCard(this.foggify, 'deck');
                this.player1.moveCard(this.dustPixie, 'deck');
                this.player1.moveCard(this.murmook, 'deck');
            });

            describe('when tide is not high and reap', function () {
                beforeEach(function () {
                    this.player1.reap(this.olPaddy);
                });

                it('should discard 1 card', function () {
                    expect(this.umbra.location).toBe('discard');
                    expect(this.foggify.location).toBe('deck');
                    expect(this.dustPixie.location).toBe('deck');
                    expect(this.murmook.location).toBe('deck');
                });

                it('should prompt to put 1 creature in play', function () {
                    this.player1.clickCard(this.umbra);
                    this.player1.clickPrompt('Left');
                    expect(this.umbra.location).toBe('play area');
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                });
            });

            describe('when tide is high and reap', function () {
                beforeEach(function () {
                    this.player1.raiseTide();
                    this.player1.reap(this.olPaddy);
                });

                it('should discard 3 cards', function () {
                    expect(this.umbra.location).toBe('discard');
                    expect(this.foggify.location).toBe('discard');
                    expect(this.dustPixie.location).toBe('discard');
                    expect(this.murmook.location).toBe('deck');
                });

                it('should prompt to put creatures in play', function () {
                    expect(this.player1).toBeAbleToSelect(this.umbra);
                    expect(this.player1).toBeAbleToSelect(this.dustPixie);
                    expect(this.player1).not.toBeAbleToSelect(this.foggify);
                    this.player1.clickCard(this.dustPixie);
                    this.player1.clickPrompt('Left');
                    expect(this.player1).toBeAbleToSelect(this.umbra);
                    expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
                    expect(this.player1).not.toBeAbleToSelect(this.foggify);
                    this.player1.clickCard(this.umbra);
                    this.player1.clickPrompt('Left');
                    expect(this.umbra.location).toBe('play area');
                    expect(this.dustPixie.location).toBe('play area');
                });
            });
        });
    });
});
