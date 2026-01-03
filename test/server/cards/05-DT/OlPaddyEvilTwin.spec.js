describe("Ol' Paddy Evil Twin", function () {
    describe("Ol' Paddy Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['ol--paddy-evil-twin', 'flaxia', 'senator-shrix']
                },
                player2: {
                    amber: 1,
                    inPlay: ['tantadlin', 'murmook', 'chain-gang'],
                    hand: ['umbra', 'bulleteye', 'foggify', 'dust-pixie']
                }
            });
        });

        describe('when opponent deck is empty', function () {
            beforeEach(function () {
                this.player2.player.deck = [];
            });

            describe('when tide is not high and reap', function () {
                beforeEach(function () {
                    this.player1.reap(this.olPaddyEvilTwin);
                });

                it('should not prompt to destroy any card', function () {
                    this.expectReadyToTakeAction(this.player1);
                });
            });

            describe('when tide is high and reap', function () {
                beforeEach(function () {
                    this.player1.raiseTide();
                    this.player1.reap(this.olPaddyEvilTwin);
                });

                it('should not prompt to destroy any card', function () {
                    this.expectReadyToTakeAction(this.player1);
                });
            });
        });

        describe('when opponent deck has 1 card', function () {
            beforeEach(function () {
                this.player2.player.deck = [];
                this.player2.moveCard(this.dustPixie, 'deck');
            });

            describe('when tide is not high and reap', function () {
                beforeEach(function () {
                    this.player1.reap(this.olPaddyEvilTwin);
                });

                it('should discard 1 card', function () {
                    expect(this.dustPixie.location).toBe('discard');
                });

                it('should prompt to destroy an Untamed creature', function () {
                    expect(this.player1).toBeAbleToSelect(this.tantadlin);
                    expect(this.player1).toBeAbleToSelect(this.flaxia);
                    expect(this.player1).toBeAbleToSelect(this.murmook);
                    expect(this.player1).not.toBeAbleToSelect(this.chainGang);
                    expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
                    this.player1.clickCard(this.murmook);
                    expect(this.murmook.location).toBe('discard');
                    this.expectReadyToTakeAction(this.player1);
                });
            });

            describe('when tide is high and reap', function () {
                beforeEach(function () {
                    this.player1.raiseTide();
                    this.player1.reap(this.olPaddyEvilTwin);
                });

                it('should discard 1 card', function () {
                    expect(this.dustPixie.location).toBe('discard');
                });

                it('should prompt to destroy an Untamed creature', function () {
                    expect(this.player1).toBeAbleToSelect(this.tantadlin);
                    expect(this.player1).toBeAbleToSelect(this.flaxia);
                    expect(this.player1).toBeAbleToSelect(this.murmook);
                    expect(this.player1).not.toBeAbleToSelect(this.chainGang);
                    expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
                    this.player1.clickCard(this.murmook);
                    expect(this.murmook.location).toBe('discard');
                    this.expectReadyToTakeAction(this.player1);
                });
            });
        });

        describe('when opponent deck has 1 card without a creature in play', function () {
            beforeEach(function () {
                this.player2.player.deck = [];
                this.player2.moveCard(this.foggify, 'deck');
            });

            describe('when tide is not high and reap', function () {
                beforeEach(function () {
                    this.player1.reap(this.olPaddyEvilTwin);
                });

                it('should discard 1 card', function () {
                    expect(this.foggify.location).toBe('discard');
                });

                it('should not prompt to destroy any card', function () {
                    this.expectReadyToTakeAction(this.player1);
                });
            });

            describe('when tide is high and reap', function () {
                beforeEach(function () {
                    this.player1.raiseTide();
                    this.player1.reap(this.olPaddyEvilTwin);
                });

                it('should discard 1 card', function () {
                    expect(this.foggify.location).toBe('discard');
                });

                it('should not prompt to destroy any card', function () {
                    this.expectReadyToTakeAction(this.player1);
                });
            });
        });

        describe('when opponent deck has many cards', function () {
            beforeEach(function () {
                this.player2.player.deck = [];
                this.player2.moveCard(this.umbra, 'deck');
                this.player2.moveCard(this.foggify, 'deck');
                this.player2.moveCard(this.dustPixie, 'deck');
                this.player2.moveCard(this.bulleteye, 'deck');
            });

            describe('when tide is not high and reap', function () {
                beforeEach(function () {
                    this.player1.reap(this.olPaddyEvilTwin);
                });

                it('should discard 1 card', function () {
                    expect(this.umbra.location).toBe('discard');
                    expect(this.foggify.location).toBe('deck');
                    expect(this.dustPixie.location).toBe('deck');
                    expect(this.bulleteye.location).toBe('deck');
                });

                it('should prompt to destroy a Shadows creature', function () {
                    expect(this.player1).not.toBeAbleToSelect(this.tantadlin);
                    expect(this.player1).not.toBeAbleToSelect(this.flaxia);
                    expect(this.player1).not.toBeAbleToSelect(this.murmook);
                    expect(this.player1).toBeAbleToSelect(this.chainGang);
                    expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
                    this.player1.clickCard(this.chainGang);
                    expect(this.chainGang.location).toBe('discard');
                    this.expectReadyToTakeAction(this.player1);
                });
            });

            describe('when tide is high and reap', function () {
                beforeEach(function () {
                    this.player1.raiseTide();
                    this.player1.reap(this.olPaddyEvilTwin);
                });

                it('should discard 3 cards', function () {
                    expect(this.umbra.location).toBe('discard');
                    expect(this.foggify.location).toBe('discard');
                    expect(this.dustPixie.location).toBe('discard');
                    expect(this.bulleteye.location).toBe('deck');
                });

                it('should prompt to destroy a Shadows or Untamed card', function () {
                    expect(this.player1).toBeAbleToSelect(this.tantadlin);
                    expect(this.player1).toBeAbleToSelect(this.flaxia);
                    expect(this.player1).toBeAbleToSelect(this.murmook);
                    expect(this.player1).toBeAbleToSelect(this.chainGang);
                    expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
                    this.player1.clickCard(this.chainGang);
                    expect(this.chainGang.location).toBe('discard');
                });
            });
        });
    });
});
