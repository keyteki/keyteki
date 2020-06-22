describe('Safe Place', function () {
    describe('when used', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'shadows',
                    inPlay: ['safe-place', 'urchin'],
                    hand: ['ghostly-hand', 'safe-place']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll']
                }
            });

            this.player1.clickCard(this.safePlace);
            this.player1.clickPrompt("Use this card's Action ability");
        });

        it('should place an amber on Safe Place when used', function () {
            expect(this.player1.amber).toBe(4);
            expect(this.safePlace.tokens.amber).toBe(1);
        });

        describe('and exactly enough amber is present to forge a key', function () {
            beforeEach(function () {
                this.player1.amber = 5;
                this.safePlace.tokens.amber = 1;
                this.player1.endTurn();
                this.player2.clickPrompt('brobnar');
                this.player2.endTurn();
                this.player1.forgeKey('Red');
            });

            it('should forge a key without prompting', function () {
                expect(this.player1.getForgedKeys()).toBe(1);
            });

            it('should remove all amber from safe place', function () {
                expect(this.safePlace.hasToken('amber')).toBe(false);
            });
        });

        describe('and more than enough amber is present to forge a key', function () {
            beforeEach(function () {
                this.player1.amber = 5;
                this.safePlace.tokens.amber = 3;
                this.player1.endTurn();
                this.player2.clickPrompt('brobnar');
                this.player2.endTurn();
            });

            it('should prompt how much amber to use', function () {
                expect(this.player1).toHavePrompt(
                    'How much amber do you want to use from Safe Place?'
                );
            });

            describe('and an amount is selected', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('1');
                    this.player1.forgeKey('Red');
                });

                it('should forge a key', function () {
                    expect(this.player1.getForgedKeys()).toBe(1);
                });

                it('should remove the selected amber from safe place', function () {
                    expect(this.safePlace.tokens.amber).toBe(2);
                });
            });
        });

        it('should take both safe place into account if there is more than one', function () {
            let otherSafePlace = this.player1.hand.find((c) => c.id === 'safe-place');
            this.player1.play(otherSafePlace);

            this.player1.amber = 3;
            otherSafePlace.tokens.amber = 2;
            this.safePlace.tokens.amber = 1;

            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            this.player1.forgeKey('Red');
        });
    });
});
