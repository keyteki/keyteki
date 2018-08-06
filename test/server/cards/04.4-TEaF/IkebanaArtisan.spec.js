describe('Ikebana Artisan', function() {
    integration(function() {
        describe('Ikebana Artisan\'s ability', function() {
            let originalHonor, originalFate;
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-challenger']
                    },
                    player2: {
                        inPlay: ['ikebana-artisan']
                    }
                });

                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.ikebanaArtisan = this.player2.findCardByName('ikebana-artisan');
            });

            describe('When not in a conflict', function() {
                it('should not be available to activate', function() {
                    this.player1.pass();
                    this.player2.clickCard(this.ikebanaArtisan);
                    expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                });
            });

            describe('When Ikebana\'s player has > 0 fate', function() {
                beforeEach(function() {
                    originalFate = 1;
                    originalHonor = 8;
                    this.player2.fate = originalFate;
                    this.player2.honor = originalHonor;
                });
                describe('and a conflict resolves unopposed by Ikebana\'s player', function() {
                    beforeEach(function() {
                        this.noMoreActions();
                        this.initiateConflict({
                            type: 'military',
                            attackers: [this.dojiChallenger],
                            defenders: []
                        });
                        this.noMoreActions();
                    });
                    it('should prompt to trigger Ikebana\'s ability', function() {
                        expect(this.player2).toHavePrompt('Any interrupts?');
                    });
                    describe('and Ikebana\'s ability is triggered', function() {
                        beforeEach(function() {
                            this.player2.clickCard(this.ikebanaArtisan);
                        });
                        it('should result in a fate loss instead of honor', function() {
                            expect(this.player2.honor).toBe(originalHonor);
                            expect(this.player2.fate).toBe(originalFate - 1);
                        });
                    });
                    describe('and Ikebana\'s ability is not triggered', function() {
                        beforeEach(function() {

                            this.player2.clickPrompt('Pass');
                        });
                        it('should result in a standard honor loss', function() {
                            expect(this.player2.honor).toBe(originalHonor - 1);
                            expect(this.player2.fate).toBe(originalFate);
                        });
                    });
                });
                describe('and a conflict resolves opposed by Ikebana\'s player', function() {
                    beforeEach(function() {
                        this.noMoreActions();
                        this.initiateConflict({
                            type: 'political',
                            ring: 'air',
                            attackers: [this.dojiChallenger],
                            defenders: [this.ikebanaArtisan]
                        });
                        this.noMoreActions();
                    });
                    it('should not prompt to trigger Ikebana\'s ability if the player has > 0 fate', function() {
                        expect(this.player2).toHavePrompt('Waiting for opponent to use Air Ring');
                    });
                    it('should result in no honor or fate loss', function() {
                        expect(this.player2.honor).toBe(originalHonor);
                        expect(this.player2.fate).toBe(originalFate);
                    });
                });
            });
            describe('When Ikebana\'s player has 0 fate', function() {
                beforeEach(function() {
                    originalFate = 0;
                    originalHonor = 8;
                    this.player2.fate = originalFate;
                    this.player2.honor = originalHonor;
                });
                describe('and a conflict resolves unopposed by Ikebana\'s player', function() {
                    beforeEach(function() {
                        this.noMoreActions();
                        this.initiateConflict({
                            type: 'military',
                            attackers: [this.dojiChallenger],
                            defenders: []
                        });
                        this.noMoreActions();
                    });
                    // http://www.cardgamedb.com/forums/index.php?/topic/39825-ruling-ikebana-artisan/
                    it('should prompt to trigger Ikebana\'s ability', function() {
                        expect(this.player2).toHavePrompt('Any interrupts?');
                    });
                    describe('and Ikebana\'s ability is triggered', function() {
                        beforeEach(function() {
                            this.player2.clickCard(this.ikebanaArtisan);
                        });
                        it('should result in no fate or honor loss', function() {
                            expect(this.player2.honor).toBe(originalHonor);
                            expect(this.player2.fate).toBe(originalFate);
                        });
                    });
                });
            });
        });
    });
});
