describe('Transporter Platform', function() {
    integration(function() {
        describe('Transporter Platform\'s ability', function() {
            beforeEach(function() {
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

            it('should return creature to owner\'s hand', function() {
                this.player1.useAction(this.transporterPlatform);
                expect(this.player1).toBeAbleToSelect(this.captainValJericho);
                expect(this.player1).toBeAbleToSelect(this.medicIngram);
                expect(this.player1).not.toBeAbleToSelect(this.transporterPlatform);
                expect(this.player1).not.toBeAbleToSelect(this.urchin);
                expect(this.player1).not.toBeAbleToSelect(this.lamindra);
                this.player1.clickCard(this.captainValJericho);
                expect(this.captainValJericho.location).toBe('hand');
            });

            it('should return creature and upgrades to owner\'s hand', function() {
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

            it('should return upgrades only when creature is warded', function() {
                this.player1.playUpgrade(this.calv1n, this.medicIngram);
                this.medicIngram.tokens.ward = 1;
                this.player1.useAction(this.transporterPlatform);
                this.player1.clickCard(this.medicIngram);
                expect(this.calv1n.location).toBe('hand');
                expect(this.medicIngram.location).toBe('play area');
                expect(this.medicIngram.tokens.ward).toBeUndefined();
            });
        });

        describe('Transporter Platform\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'dis',
                        hand: ['collar-of-subordination'],
                        inPlay: ['transporter-platform', 'captain-val-jericho', 'medic-ingram']
                    },
                    player2: {
                        inPlay: ['urchin', 'lamindra', 'flaxia'],
                        hand: ['way-of-the-bear']
                    }
                });
            });

            it('should return creature to owner\'s hand', function() {
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
        });
    });
});
