describe('Friendly Guide', function () {
    describe("Friendly Guide's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: [
                        'niffle-ape',
                        'friendly-guide',
                        'dark-faerie',
                        'rustgnawer',
                        'guji-dinosaur-hunter'
                    ]
                },
                player2: {
                    inPlay: ['dextre', 'hunting-witch', 'shĭzyokŭ-swopper']
                }
            });
        });

        it('should allow use on reap', function () {
            this.player1.reap(this.niffleApe);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.friendlyGuide);
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.huntingWitch);
            expect(this.huntingWitch.location).toBe('discard');
        });

        it('should allow use on fight', function () {
            this.player1.fightWith(this.darkFaerie, this.huntingWitch);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.friendlyGuide);
            this.player1.clickPrompt('Reap with this creature');
        });

        it('should allow use on fight where attacker dies', function () {
            this.player1.fightWith(this.niffleApe, this.dextre);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.friendlyGuide);
            this.player1.clickPrompt('Reap with this creature');
        });

        it('should only work on neighboring creatures', function () {
            this.player1.reap(this.rustgnawer);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not work for opponent after a swap', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('ekwidon');
            this.player2.fightWith(this.shĭzyokŭSwopper, this.niffleApe);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should allow use on action ability that removes from play', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('ekwidon');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.fightWith(this.gujiDinosaurHunter, this.huntingWitch);
            this.player1.moveCard(this.darkFaerie, 'discard');
            this.player1.moveCard(this.rustgnawer, 'discard');
            this.gujiDinosaurHunter.ready();
            this.player1.useAction(this.gujiDinosaurHunter);
            this.player1.clickCard(this.gujiDinosaurHunter);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.friendlyGuide);
            this.player1.clickPrompt('Reap with this creature');
        });
    });

    describe("Friendly Guide's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['friendly-guide', 'aquilia-lone-hero']
                },
                player2: {
                    inPlay: ['dextre']
                }
            });
        });

        it('should trigger when neighbor uses omni ability even if condition is not met', function () {
            this.player1.useOmni(this.aquiliaLoneHero);
            this.player1.clickCard(this.friendlyGuide);
            expect(this.player1).toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton('Fight with this creature');
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should trigger when stunned neighbor uses omni ability', function () {
            this.aquiliaLoneHero.stun();
            this.player1.clickCard(this.aquiliaLoneHero);
            this.player1.clickPrompt("Remove this creature's stun");
            this.player1.clickCard(this.friendlyGuide);
            expect(this.player1).toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton('Fight with this creature');
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
