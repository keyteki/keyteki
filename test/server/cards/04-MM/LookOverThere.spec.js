describe('Look Over There', function () {
    describe("Look Over There's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['look-over-there']
                },
                player2: {
                    amber: 1,
                    inPlay: ['dodger', 'bad-penny']
                }
            });
            this.player1.play(this.lookOverThere);
        });

        it('able to select creature', function () {
            expect(this.player1).toBeAbleToSelect(this.dodger);
            expect(this.player1).toBeAbleToSelect(this.badPenny);
        });

        describe('damages 5 power creature', function () {
            beforeEach(function () {
                this.player1.clickCard(this.dodger);
            });

            it('deal damage and steal', function () {
                expect(this.player1.amber).toBe(1);
                expect(this.player2.amber).toBe(0);
                expect(this.dodger.damage).toBe(2);
                expect(this.dodger.location).toBe('play area');
                expect(this.badPenny.location).toBe('play area');
            });
        });

        describe('damages 1 power creature', function () {
            beforeEach(function () {
                this.player1.clickCard(this.badPenny);
            });

            it('deal damage, destroy and not steal', function () {
                expect(this.player1.amber).toBe(0);
                expect(this.player2.amber).toBe(1);
                expect(this.dodger.damage).toBe(0);
                expect(this.dodger.location).toBe('play area');
                expect(this.badPenny.location).toBe('hand');
            });
        });
    });

    describe("Look Over There's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['look-over-there']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('if no creature, no steal', function () {
            this.player1.play(this.lookOverThere);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Look Over There's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'sanctum',
                    hand: ['armageddon-cloak'],
                    inPlay: ['bingle-bangbang', 'the-grey-rider', 'lamindra', 'shadow-self']
                },
                player2: {
                    hand: ['look-over-there']
                }
            });

            this.shadowSelf.tokens.damage = 8;
            this.theGreyRider.tokens.ward = 1;
            this.player1.playUpgrade(this.armageddonCloak, this.bingleBangbang); // add 1 amber
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
        });

        it('if creature is warded, should steal', function () {
            this.player2.play(this.lookOverThere);
            this.player2.clickCard(this.theGreyRider);
            expect(this.theGreyRider.warded).toBe(false);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
        });

        it('if damage is replaced by SS and SS is destroyed, should steal', function () {
            this.player2.play(this.lookOverThere);
            this.player2.clickCard(this.lamindra);
            expect(this.lamindra.location).toBe('play area');
            expect(this.shadowSelf.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
        });

        it('if destruction is replaced by AG, should steal', function () {
            this.player2.play(this.lookOverThere);
            this.player2.clickCard(this.bingleBangbang);
            expect(this.bingleBangbang.location).toBe('play area');
            expect(this.armageddonCloak.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
        });
    });
});
