describe('Tendrils of Pain', function () {
    describe("Tendrils of Pain's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['troll', 'chota-hazri'],
                    hand: ['tendrils-of-pain']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'hunting-witch', 'helper-bot'],
                    amber: 6
                }
            });
            this.helperBot.ward();
            this.chotaHazri.ward();
            this.mightyTiger.ward();
        });

        describe('if opponent forges a key', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.forgeKey('Red');
                this.player2.clickPrompt('untamed');
                this.player2.endTurn();
            });

            it('player 2 forges a key', function () {
                expect(this.player2.player.keys.red).toBe(true);
                expect(this.player2.player.keys.blue).toBe(false);
                expect(this.player2.player.keys.yellow).toBe(false);
                expect(this.player2.amber).toBe(0);
                expect(this.helperBot.warded).toBe(true);
                expect(this.chotaHazri.warded).toBe(true);
                expect(this.mightyTiger.warded).toBe(true);
            });
            describe('play tendrils of pain', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('dis');
                    this.player1.play(this.tendrilsOfPain);
                });
                it('Tendrils deals 4 damage', function () {
                    expect(this.helperBot.location).toBe('play area');
                    expect(this.chotaHazri.location).toBe('play area');
                    expect(this.huntingWitch.location).toBe('discard');
                    expect(this.mightyTiger.warded).toBe(false);
                    expect(this.mightyTiger.tokens.damage).toBe(undefined);
                    expect(this.troll.tokens.damage).toBe(4);
                });
            });
        });

        describe('if opponent does not forge a key', function () {
            it('player 2 forges a key', function () {
                expect(this.player2.player.keys.red).toBe(false);
                expect(this.player2.player.keys.blue).toBe(false);
                expect(this.player2.player.keys.yellow).toBe(false);
                expect(this.player2.amber).toBe(6);
                expect(this.helperBot.warded).toBe(true);
                expect(this.chotaHazri.warded).toBe(true);
                expect(this.mightyTiger.warded).toBe(true);
            });
            describe('play tendrils of pain', function () {
                beforeEach(function () {
                    this.player1.play(this.tendrilsOfPain);
                });
                it('Tendrils deals 1 damage', function () {
                    expect(this.helperBot.location).toBe('play area');
                    expect(this.chotaHazri.location).toBe('play area');
                    expect(this.huntingWitch.location).toBe('play area');
                    expect(this.mightyTiger.warded).toBe(false);
                    expect(this.helperBot.warded).toBe(false);
                    expect(this.mightyTiger.tokens.damage).toBe(undefined);
                    expect(this.helperBot.tokens.damage).toBe(undefined);
                    expect(this.troll.tokens.damage).toBe(1);
                    expect(this.chotaHazri.tokens.damage).toBe(undefined);
                    expect(this.huntingWitch.tokens.damage).toBe(1);
                });
            });
        });
    });
});
