describe('Eclectic Ambrosius', function () {
    describe("Eclectic Ambrosius's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['eclectic-ambrosius', 'senator-shrix']
                },
                player2: {
                    inPlay: ['dust-imp', 'dew-faerie', 'ancient-bear']
                }
            });
        });

        describe('at end of turn', function () {
            beforeEach(function () {
                this.player1.endTurn();
            });

            it('should place a knowledge counter at end of turn', function () {
                expect(this.eclecticAmbrosius.tokens.knowledge).toBe(1);
            });
        });

        describe('when used and it has no knowledge counters', function () {
            beforeEach(function () {
                this.player1.useAction(this.eclecticAmbrosius);
            });

            it('should continue without counters', function () {
                expect(this.eclecticAmbrosius.tokens.knowledge).toBeUndefined();
            });

            it('should not gain amber', function () {
                expect(this.player1.amber).toBe(0);
            });
        });

        describe('when used and it has less than 3 knowledge counters', function () {
            beforeEach(function () {
                this.eclecticAmbrosius.tokens.knowledge = 2;
                this.player1.useAction(this.eclecticAmbrosius);
            });

            it('should remove those counters', function () {
                expect(this.eclecticAmbrosius.tokens.knowledge).toBeUndefined();
            });

            it('should not gain amber', function () {
                expect(this.player1.amber).toBe(0);
            });
        });

        describe('when used and it has more than 3 knowledge counters', function () {
            beforeEach(function () {
                this.eclecticAmbrosius.tokens.knowledge = 4;
                this.player1.useAction(this.eclecticAmbrosius);
            });

            it('should remove 3 counters', function () {
                expect(this.eclecticAmbrosius.tokens.knowledge).toBe(1);
            });

            it('should gain 6 amber', function () {
                expect(this.player1.amber).toBe(6);
            });
        });
    });
});
