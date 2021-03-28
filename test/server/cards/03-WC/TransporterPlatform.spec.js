describe('Transporter Platform', function () {
    describe("Transporter Platform's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['calv-1n'],
                    inPlay: ['transporter-platform', 'captain-val-jericho', 'medic-ingram']
                },
                player2: {
                    inPlay: ['urchin', 'lamindra']
                }
            });
        });

        it('should be able to use and return no creature, when no creatures in play', function () {
            this.player1.moveCard(this.medicIngram, 'discard');
            this.player1.moveCard(this.captainValJericho, 'discard');
            this.player1.useAction(this.transporterPlatform);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should return creature to owner's hand", function () {
            this.player1.useAction(this.transporterPlatform);
            expect(this.player1).toBeAbleToSelect(this.captainValJericho);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).not.toBeAbleToSelect(this.transporterPlatform);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.captainValJericho);
            expect(this.captainValJericho.location).toBe('hand');
        });

        it('should not return creature when it is warded', function () {
            this.medicIngram.tokens.ward = 1;
            this.player1.useAction(this.transporterPlatform);
            this.player1.clickCard(this.medicIngram);
            expect(this.medicIngram.location).toBe('play area');
            expect(this.medicIngram.tokens.ward).toBeUndefined();
        });

        it("should return creature and upgrades to owner's hand", function () {
            this.player1.playUpgrade(this.calv1n, this.captainValJericho);
            this.player1.useAction(this.transporterPlatform);
            expect(this.player1).toBeAbleToSelect(this.captainValJericho);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).not.toBeAbleToSelect(this.calv1n);
            expect(this.player1).not.toBeAbleToSelect(this.transporterPlatform);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.captainValJericho);
            expect(this.calv1n.location).toBe('hand');
            expect(this.captainValJericho.location).toBe('hand');
        });

        it('should return upgrades only when creature is warded', function () {
            this.player1.playUpgrade(this.calv1n, this.medicIngram);
            this.medicIngram.tokens.ward = 1;
            this.player1.useAction(this.transporterPlatform);
            this.player1.clickCard(this.medicIngram);
            expect(this.calv1n.location).toBe('hand');
            expect(this.medicIngram.location).toBe('play area');
            expect(this.medicIngram.tokens.ward).toBeUndefined();
        });
    });

    describe("Transporter Platform's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['collar-of-subordination', 'calv-1n', 'cloaking-dongle'],
                    inPlay: ['transporter-platform', 'captain-val-jericho', 'medic-ingram']
                },
                player2: {
                    inPlay: ['urchin', 'lamindra', 'flaxia'],
                    hand: ['way-of-the-bear', 'poltergeist', 'soulkeeper', 'tentacus']
                }
            });
        });

        it("should return creature and upgrades to owner's hand", function () {
            this.player1.playUpgrade(this.collarOfSubordination, this.lamindra);
            this.player1.clickPrompt('Left');
            this.player1.endTurn();

            this.player2.clickPrompt('untamed');
            this.player2.playUpgrade(this.wayOfTheBear, this.lamindra);
            this.player2.endTurn();

            this.player1.clickPrompt('staralliance');
            this.player1.useAction(this.transporterPlatform);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.lamindra);

            expect(this.lamindra.location).toBe('hand');
            expect(this.collarOfSubordination.location).toBe('hand');
            expect(this.wayOfTheBear.location).toBe('hand');

            expect(this.player1.player.hand).toContain(this.collarOfSubordination);
            expect(this.player2.player.hand).toContain(this.wayOfTheBear);
            expect(this.player2.player.hand).toContain(this.lamindra);
        });

        it("should return upgrades only to owner's hand", function () {
            this.player1.playUpgrade(this.collarOfSubordination, this.lamindra);
            this.player1.clickPrompt('Left');
            this.player1.endTurn();

            this.player2.clickPrompt('untamed');
            this.player2.playUpgrade(this.wayOfTheBear, this.lamindra);
            this.player2.endTurn();

            this.player1.clickPrompt('staralliance');
            this.lamindra.tokens.ward = 1;
            this.player1.playUpgrade(this.calv1n, this.lamindra);
            this.player1.useAction(this.transporterPlatform);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.lamindra);

            expect(this.lamindra.location).toBe('play area');
            expect(this.lamindra.tokens.ward).toBeUndefined();
            expect(this.calv1n.location).toBe('hand');
            expect(this.collarOfSubordination.location).toBe('hand');
            expect(this.wayOfTheBear.location).toBe('hand');

            expect(this.player1.player.hand).toContain(this.collarOfSubordination);
            expect(this.player1.player.hand).toContain(this.calv1n);
            expect(this.player2.player.hand).toContain(this.wayOfTheBear);
        });

        it('should be able to select own creature after Poltergeist', function () {
            this.player1.endTurn();

            this.player2.clickPrompt('dis');
            this.player2.playUpgrade(this.soulkeeper, this.lamindra);
            this.player2.play(this.poltergeist);
            this.player2.clickCard(this.transporterPlatform);
            this.player2.clickCard(this.lamindra);

            expect(this.lamindra.location).toBe('hand');
            expect(this.soulkeeper.location).toBe('hand');
            expect(this.transporterPlatform.location).toBe('discard');
        });

        it('should be able to pay to use Transporter Platform', function () {
            this.player1.endTurn();

            this.player2.clickPrompt('dis');
            this.player2.play(this.tentacus);
            this.player2.endTurn();

            this.player1.clickPrompt('staralliance');
            this.player1.playUpgrade(this.cloakingDongle, this.medicIngram);
            this.player1.useAction(this.transporterPlatform);
            this.player1.clickCard(this.medicIngram);

            expect(this.medicIngram.location).toBe('hand');
            expect(this.cloakingDongle.location).toBe('hand');
            expect(this.player1.amber).toBe(0);
        });

        it('should not be able to use Transporter Platform if player has no amber', function () {
            this.player1.endTurn();

            this.player2.clickPrompt('dis');
            this.player2.play(this.tentacus);
            this.player2.endTurn();

            this.player1.clickPrompt('staralliance');
            this.player1.clickCard(this.transporterPlatform);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
