describe('Kaupe', function () {
    describe("Kaupe's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['armsmaster-molina'],
                    hand: [
                        'commander-chan',
                        'doctor-driscoll',
                        'explo-rover',
                        'uncharted-lands',
                        'transporter-platform',
                        'access-denied',
                        'detention-coil',
                        'stealth-mode',
                        'galactic-census'
                    ]
                },
                player2: {
                    inPlay: ['kaupe']
                }
            });
        });

        it('should be able to play 1 card of each only while kaupe is in play', function () {
            this.player1.play(this.stealthMode);
            expect(this.stealthMode.location).toBe('discard');
            this.player1.play(this.doctorDriscoll);
            expect(this.doctorDriscoll.location).toBe('play area');
            this.player1.play(this.unchartedLands);
            expect(this.unchartedLands.location).toBe('play area');
            this.player1.playUpgrade(this.accessDenied, this.kaupe);
            expect(this.accessDenied.parent).toBe(this.kaupe);

            this.player1.clickCard(this.commanderChan);
            expect(this.player1).not.toHavePromptButton('Play this creature');
            this.player1.clickPrompt('Discard this card');

            this.player1.clickCard(this.exploRover);
            expect(this.player1).not.toHavePromptButton('Play this creature');
            expect(this.player1).not.toHavePromptButton('Play this upgrade');
            this.player1.clickPrompt('Discard this card');

            this.player1.clickCard(this.detentionCoil);
            expect(this.player1).not.toHavePromptButton('Play this upgrade');
            this.player1.clickPrompt('Discard this card');

            this.player1.clickCard(this.transporterPlatform);
            expect(this.player1).not.toHavePromptButton('Play this artifact');
            this.player1.clickPrompt('Discard this card');

            this.player1.clickCard(this.galacticCensus);
            expect(this.player1).not.toHavePromptButton('Play this action');
            this.player1.clickPrompt('Discard this card');
        });

        it('should be able to play explo-rover as upgrade', function () {
            this.player1.playUpgrade(this.exploRover, this.kaupe);
            expect(this.exploRover.parent).toBe(this.kaupe);

            this.player1.clickCard(this.accessDenied);
            expect(this.player1).not.toHavePromptButton('Play this upgrade');
            this.player1.clickPrompt('Discard this card');

            this.player1.clickCard(this.detentionCoil);
            expect(this.player1).not.toHavePromptButton('Play this upgrade');
            this.player1.clickPrompt('Discard this card');
        });

        it('should be able to play mores cards once Kaupe is destroyed', function () {
            this.player1.fightWith(this.armsmasterMolina, this.kaupe);
            expect(this.kaupe.location).toBe('discard');
            this.player1.play(this.stealthMode);
            this.player1.play(this.doctorDriscoll);
            this.player1.play(this.unchartedLands);
            this.player1.playUpgrade(this.accessDenied, this.armsmasterMolina);
            this.player1.play(this.commanderChan);
            this.player1.playUpgrade(this.exploRover, this.armsmasterMolina);
            this.player1.play(this.transporterPlatform);
            this.player1.play(this.galacticCensus);
        });
    });
});
