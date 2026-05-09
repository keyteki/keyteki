describe('Slapdash Enamel', function () {
    describe("Slapdash Enamel's action", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['slapdash-enamel', 'troll']
                },
                player2: {
                    inPlay: ['urchin']
                }
            });
        });

        it('puts a corrosion counter on a friendly creature', function () {
            this.player1.useAction(this.slapdashEnamel);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.slapdashEnamel);
            this.player1.clickCard(this.troll);
            expect(this.troll.hasToken('corrosion')).toBe(true);
            expect(this.troll.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('can target an enemy creature', function () {
            this.player1.useAction(this.slapdashEnamel);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.hasToken('corrosion')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can target itself', function () {
            this.player1.useAction(this.slapdashEnamel);
            this.player1.clickCard(this.slapdashEnamel);
            expect(this.slapdashEnamel.hasToken('corrosion')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Slapdash Enamel's start-of-turn destruction", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['slapdash-enamel', 'troll']
                },
                player2: {
                    inPlay: ['urchin']
                }
            });
        });

        it('destroys a creature with a corrosion counter at the start of its controllers turn', function () {
            this.player1.useAction(this.slapdashEnamel);
            this.player1.clickCard(this.troll);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            expect(this.troll.location).toBe('discard');
            expect(this.urchin.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not destroy a creature with no corrosion counter', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            expect(this.troll.location).toBe('play area');
            expect(this.urchin.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not trigger on the opponents turn', function () {
            this.player1.useAction(this.slapdashEnamel);
            this.player1.clickCard(this.urchin);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            expect(this.urchin.location).toBe('play area');
            expect(this.urchin.hasToken('corrosion')).toBe(true);
        });

        it('destroys multiple corroded cards simultaneously, including itself', function () {
            this.player1.useAction(this.slapdashEnamel);
            this.player1.clickCard(this.troll);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            expect(this.troll.location).toBe('discard');
            expect(this.slapdashEnamel.location).toBe('play area');
            this.urchin.addToken('corrosion', 1);
            this.slapdashEnamel.addToken('corrosion', 1);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            expect(this.slapdashEnamel.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Slapdash Enamel's start-of-turn destruction with upgrades", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['slapdash-enamel', 'troll'],
                    hand: ['weak-link']
                },
                player2: {}
            });
        });

        it('destroys a corroded upgrade attached to a creature', function () {
            this.player1.playUpgrade(this.weakLink, this.troll);
            this.player1.useAction(this.slapdashEnamel);
            this.player1.clickCard(this.weakLink);
            expect(this.weakLink.hasToken('corrosion')).toBe(true);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            expect(this.weakLink.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
