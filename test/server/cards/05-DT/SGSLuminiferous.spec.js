describe('SGS Luminiferous', function () {
    describe("SGS Luminiferous's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: [
                        'sgs-luminiferous',
                        'bulwark',
                        'ardent-hero',
                        'champion-anaphiel',
                        'grey-monk',
                        'flaxia',
                        'epic-quest'
                    ]
                },
                player2: {
                    inPlay: ['shooler', 'lyco-bot', 'ganymede-archivist', 'helper-bot']
                }
            });
        });

        it('should be optional', function () {
            this.player1.useAction(this.sgsLuminiferous);
            this.player1.clickPrompt('Done');
            this.player1.endTurn();
        });

        it('should prompt to exalt and stun creatures', function () {
            this.player1.useAction(this.sgsLuminiferous);

            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.ardentHero);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).toBeAbleToSelect(this.greyMonk);
            expect(this.player1).not.toBeAbleToSelect(this.epicQuest);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.lycoBot);
            expect(this.player1).not.toBeAbleToSelect(this.ganymedeArchivist);
            expect(this.player1).not.toBeAbleToSelect(this.helperBot);

            this.player1.clickCard(this.bulwark);
            this.player1.clickCard(this.ardentHero);
            this.player1.clickCard(this.championAnaphiel);
            this.player1.clickCard(this.greyMonk);
            this.player1.clickPrompt('Done');

            expect(this.bulwark.exhausted).toBe(true);
            expect(this.ardentHero.exhausted).toBe(true);
            expect(this.championAnaphiel.exhausted).toBe(true);
            expect(this.greyMonk.exhausted).toBe(true);

            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.ardentHero);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).toBeAbleToSelect(this.greyMonk);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.lycoBot);
            expect(this.player1).toBeAbleToSelect(this.ganymedeArchivist);
            expect(this.player1).toBeAbleToSelect(this.helperBot);

            this.player1.clickCard(this.shooler);
            this.player1.clickCard(this.lycoBot);
            this.player1.clickCard(this.helperBot);
            this.player1.clickCard(this.flaxia);

            this.player1.clickPrompt('Done');

            expect(this.bulwark.stunned).toBe(false);
            expect(this.ardentHero.stunned).toBe(false);
            expect(this.championAnaphiel.stunned).toBe(false);
            expect(this.greyMonk.stunned).toBe(false);
            expect(this.flaxia.stunned).toBe(true);
            expect(this.shooler.stunned).toBe(true);
            expect(this.lycoBot.stunned).toBe(true);
            expect(this.ganymedeArchivist.stunned).toBe(false);
            expect(this.helperBot.stunned).toBe(true);

            expect(this.bulwark.amber).toBe(0);
            expect(this.ardentHero.amber).toBe(0);
            expect(this.championAnaphiel.amber).toBe(0);
            expect(this.greyMonk.amber).toBe(0);
            expect(this.flaxia.amber).toBe(1);
            expect(this.shooler.amber).toBe(1);
            expect(this.lycoBot.amber).toBe(1);
            expect(this.ganymedeArchivist.amber).toBe(0);
            expect(this.helperBot.amber).toBe(1);

            this.player1.endTurn();
        });

        it('should prompt for only 2 creature if 2 of the creatures were already exhausted', function () {
            this.ardentHero.exhaust();
            this.greyMonk.exhaust();

            this.player1.useAction(this.sgsLuminiferous);

            this.player1.clickCard(this.bulwark);
            this.player1.clickCard(this.ardentHero);
            this.player1.clickCard(this.championAnaphiel);
            this.player1.clickCard(this.greyMonk);
            this.player1.clickPrompt('Done');

            expect(this.bulwark.exhausted).toBe(true);
            expect(this.ardentHero.exhausted).toBe(true);
            expect(this.championAnaphiel.exhausted).toBe(true);
            expect(this.greyMonk.exhausted).toBe(true);

            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.ardentHero);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).toBeAbleToSelect(this.greyMonk);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.lycoBot);
            expect(this.player1).toBeAbleToSelect(this.ganymedeArchivist);
            expect(this.player1).toBeAbleToSelect(this.helperBot);

            this.player1.clickCard(this.shooler);
            this.player1.clickCard(this.flaxia);

            this.player1.clickPrompt('Done');

            expect(this.bulwark.stunned).toBe(false);
            expect(this.ardentHero.stunned).toBe(false);
            expect(this.championAnaphiel.stunned).toBe(false);
            expect(this.greyMonk.stunned).toBe(false);
            expect(this.flaxia.stunned).toBe(true);
            expect(this.shooler.stunned).toBe(true);
            expect(this.lycoBot.stunned).toBe(false);
            expect(this.ganymedeArchivist.stunned).toBe(false);
            expect(this.helperBot.stunned).toBe(false);

            expect(this.bulwark.amber).toBe(0);
            expect(this.ardentHero.amber).toBe(0);
            expect(this.championAnaphiel.amber).toBe(0);
            expect(this.greyMonk.amber).toBe(0);
            expect(this.flaxia.amber).toBe(1);
            expect(this.shooler.amber).toBe(1);
            expect(this.lycoBot.amber).toBe(0);
            expect(this.ganymedeArchivist.amber).toBe(0);
            expect(this.helperBot.amber).toBe(0);

            this.player1.endTurn();
        });
    });
});
