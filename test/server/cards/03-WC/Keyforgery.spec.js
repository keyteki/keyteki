describe('Keyforgery', function () {
    describe("Keyforgery's constant ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['keyforgery', 'gamgee'],
                    hand: ['lamindra', 'lamindra', 'lamindra', 'lamindra', 'lamindra', 'lamindra']
                },
                player2: {
                    inPlay: ['troll', 'keyfrog']
                }
            });
        });

        it('should not ask for Keyforgery house when not forging a key', function () {
            this.player1.endTurn();
            expect(this.player2).not.toHavePrompt('Keyforgery');
            expect(this.player2).toHavePrompt('House Choice');
        });

        it('should not ask for Keyforgery when owner of artifact if forging a key', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('Brobnar');
            this.player2.endTurn();
            expect(this.player1).not.toHavePrompt('Keyforgery');
            expect(this.player1).toHavePrompt('House Choice');
        });

        it('should ask for Keyforgery house when forging a key', function () {
            this.player2.amber = 6;
            this.player1.endTurn();
            expect(this.player2).toHavePrompt('Keyforgery');
        });

        it('should not destroy artifact and forge a key if the selected house is from the revealed card', function () {
            this.player2.amber = 6;
            this.player1.endTurn();
            expect(this.player2).toHavePrompt('Keyforgery');
            this.player2.clickPrompt('shadows');
            this.player2.forgeKey('Red');
            expect(this.player2.player.getForgedKeys()).toBe(1);
            expect(this.keyforgery.location).toBe('play area');
        });

        it('should destroy artifact and skip forge key step if the selected house is not from the revealed card', function () {
            this.player2.amber = 6;
            this.player1.endTurn();
            expect(this.player2).toHavePrompt('Keyforgery');
            this.player2.clickPrompt('dis');
            expect(this.player2).not.toHavePrompt('Which key would you like to forge?');
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.player2.amber).toBe(6);
            expect(this.keyforgery.location).toBe('discard');
        });

        it('should not prompt when forging due to keyfrog', function () {
            this.player2.amber = 6;
            this.player1.fightWith(this.gamgee, this.keyfrog);
            this.player1.clickPrompt('red');
            expect(this.player2.player.getForgedKeys()).toBe(1);
            expect(this.keyforgery.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });
    });

    describe("Keyforgery's constant ability with 2 in play", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['keyforgery', 'keyforgery'],
                    hand: ['lamindra', 'lamindra', 'lamindra', 'lamindra', 'lamindra', 'lamindra']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
            this.keyforgery1 = this.player1.inPlay[0];
            this.keyforgery2 = this.player1.inPlay[1];
        });

        describe('at the end of my turn', function () {
            beforeEach(function () {
                this.player2.amber = 6;
                this.player1.endTurn();
            });

            describe("player chooses a house and card revealed doesn't match for first keyforgery", function () {
                beforeEach(function () {
                    this.player2.clickCard(this.keyforgery1);
                    this.player2.clickPrompt('brobnar');
                });

                it('should not forge a key, destroy kerforgey1, not prompt for second keyforgey', function () {
                    expect(this.player2.player.getForgedKeys()).toBe(0);
                    expect(this.keyforgery1.location).toBe('discard');
                    expect(this.keyforgery2.location).toBe('play area');
                    expect(this.player2).toHavePrompt(
                        'Choose which house you want to activate this turn'
                    );
                });
            });

            describe('player chooses a house and card revealed matches for first keyforgery', function () {
                beforeEach(function () {
                    this.player2.clickCard(this.keyforgery1);
                    this.player2.clickPrompt('shadows');
                });

                it('should not forge a key and prompt for the second keyforgery', function () {
                    expect(this.player2.player.getForgedKeys()).toBe(0);
                    expect(this.keyforgery1.location).toBe('play area');
                    expect(this.keyforgery2.location).toBe('play area');
                    expect(this.player2).toHavePrompt('Keyforgery');
                });

                describe('player chooses a house and card revealed matches for second keyforgery', function () {
                    beforeEach(function () {
                        this.player2.clickPrompt('shadows');
                    });

                    it('should not forge a key and prompt for the second keyforgery', function () {
                        this.player2.forgeKey('Red');
                        expect(this.player2.player.getForgedKeys()).toBe(1);
                        expect(this.keyforgery1.location).toBe('play area');
                        expect(this.keyforgery2.location).toBe('play area');
                    });
                });

                describe("player chooses a house and card revealed doesn't match for second keyforgery", function () {
                    beforeEach(function () {
                        this.player2.clickPrompt('brobnar');
                    });

                    it('should not forge a key and destroy second keyforgery', function () {
                        expect(this.player2.player.getForgedKeys()).toBe(0);
                        expect(this.keyforgery1.location).toBe('play area');
                        expect(this.keyforgery2.location).toBe('discard');
                    });
                });
            });
        });
    });
});
