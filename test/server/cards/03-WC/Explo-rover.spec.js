describe('Explo-rover', function () {
    describe('Explo-rover creature/upgrade', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['niffle-ape', 'explo-rover', 'nature-s-call', 'masterplan'],
                    inPlay: ['dust-pixie']
                },
                player2: {
                    inPlay: ['umbra']
                }
            });
        });

        it('is not an upgrade if played under masterplan', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.play(this.masterplan);
            this.player1.clickCard(this.exploRover);
            expect(this.exploRover.parent).toBe(this.masterplan);
            expect(this.exploRover.type).toBe('creature');
        });

        it('is gives the player the choice to play as an upgrade from masterplan', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.play(this.masterplan);
            this.player1.clickCard(this.exploRover);
            this.masterplan.ready();
            this.player1.clickCard(this.masterplan);
            this.player1.clickPrompt("Use this card's Omni ability");
            this.player1.clickPrompt('Play this upgrade');
            this.player1.clickCard(this.dustPixie);
            expect(this.exploRover.type).toBe('upgrade');
            expect(this.exploRover.location).toBe('play area');
            expect(this.exploRover.parent).toBe(this.dustPixie);
        });

        it("other creatures can't be played as upgrades", function () {
            this.player1.clickCard(this.niffleApe);
            expect(this.player1).not.toHavePromptButton('Play this upgrade');
        });

        it('becomes a creature again after playing as an upgade', function () {
            this.player1.playUpgrade(this.exploRover, this.dustPixie);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.play(this.natureSCall);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Done');
            expect(this.exploRover.type).toBe('creature');
        });

        it('is played as a creature that has skirmish', function () {
            this.player1.clickCard(this.exploRover);
            expect(this.player1).toHavePromptButton('Play this upgrade');
            this.player1.play(this.exploRover);
            expect(this.exploRover.type).toBe('creature');
            expect(this.exploRover.location).toBe('play area');
            expect(this.exploRover.parent).toBe(null);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.fightWith(this.exploRover, this.umbra);
            expect(this.exploRover.tokens.damage).toBe(undefined);
            expect(this.umbra.location).toBe('discard');
        });

        it('is played as an upgrade to grant skirmish', function () {
            this.player1.playUpgrade(this.exploRover, this.dustPixie);
            expect(this.exploRover.type).toBe('upgrade');
            expect(this.exploRover.location).toBe('play area');
            expect(this.exploRover.parent).toBe(this.dustPixie);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.fightWith(this.dustPixie, this.umbra);
            expect(this.dustPixie.tokens.damage).toBe(undefined);
            expect(this.umbra.tokens.damage).toBe(1);
        });
    });
});
