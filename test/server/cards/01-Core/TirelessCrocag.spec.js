describe('Tireless Crocag', function () {
    describe("Tireless Crocag's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['ancient-bear', 'troll'],
                    hand: ['tireless-crocag']
                },
                player2: {
                    hand: ['foggify']
                }
            });
        });

        it('should be destroyed immediately after being played if opponent has no creatures', function () {
            this.player1.play(this.tirelessCrocag);
            expect(this.tirelessCrocag.location).toBe('discard');
        });
    });

    describe("Tireless Crocag's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['ancient-bear', 'troll'],
                    hand: ['tireless-crocag', 'punch', 'mother']
                },
                player2: {
                    inPlay: ['bingle-bangbang'],
                    hand: ['foggify']
                }
            });
        });

        it('should stay in play if opponent has creatures on the board', function () {
            this.player1.play(this.tirelessCrocag);
            expect(this.tirelessCrocag.location).toBe('play area');
        });

        it('should destroy itself if opponent has no creatures on the board', function () {
            this.player1.play(this.tirelessCrocag);
            expect(this.tirelessCrocag.location).toBe('play area');
            this.player1.play(this.punch);
            this.player1.clickCard(this.bingleBangbang);
            expect(this.bingleBangbang.location).toBe('discard');
            expect(this.tirelessCrocag.location).toBe('discard');
        });

        it('should be destroyed even if warded', function () {
            this.player1.play(this.tirelessCrocag);
            this.tirelessCrocag.ward();
            this.player1.play(this.punch);
            this.player1.clickCard(this.bingleBangbang);
            expect(this.bingleBangbang.location).toBe('discard');
            expect(this.tirelessCrocag.location).toBe('discard');
        });

        it('should destroy itself if opponent has no creatures on the board and its their fault', function () {
            this.player1.play(this.tirelessCrocag);
            expect(this.tirelessCrocag.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.bingleBangbang, this.tirelessCrocag);
            expect(this.bingleBangbang.location).toBe('discard');
            expect(this.tirelessCrocag.location).toBe('discard');
        });

        it('should be unable to reap', function () {
            this.player1.play(this.tirelessCrocag);
            expect(this.tirelessCrocag.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.clickCard(this.tirelessCrocag);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
        });

        it('should be useable in any house', function () {
            this.player1.play(this.tirelessCrocag);
            expect(this.tirelessCrocag.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.play(this.mother);
            this.player1.clickCard(this.tirelessCrocag);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            this.player1.clickPrompt('Cancel');
            this.player1.fightWith(this.tirelessCrocag, this.bingleBangbang);
        });
    });

    describe("Weasand's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['tireless-crocag']
                },
                player2: {
                    inPlay: ['bulwark'],
                    hand: ['armageddon-cloak']
                }
            });
        });

        it('should be destroyed even with armageddon cloack', function () {
            this.player1.play(this.tirelessCrocag);
            expect(this.tirelessCrocag.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.playUpgrade(this.armageddonCloak, this.tirelessCrocag);
            this.player2.fightWith(this.bulwark, this.tirelessCrocag);
            expect(this.bulwark.location).toBe('discard');
            expect(this.tirelessCrocag.location).toBe('discard');
            expect(this.armageddonCloak.location).toBe('discard');
        });
    });
});
