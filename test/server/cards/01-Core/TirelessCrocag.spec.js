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
            this.player1.fightWith(this.tirelessCrocag, this.bingleBangbang);
        });

        it('should not apply effects to other creatures', function () {
            this.player1.play(this.tirelessCrocag);
            expect(this.tirelessCrocag.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.clickCard(this.ancientBear);
            this.player1.endTurn();
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

    describe("Opponent Harland Mindlock's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['tireless-crocag', 'ganger-chieftain', 'brammo']
                },
                player2: {
                    hand: ['harland-mindlock']
                }
            });
        });

        it('should be destroyed when mindlock controlled creature return to owner', function () {
            this.player1.play(this.brammo);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.harlandMindlock);
            this.player2.clickCard(this.brammo);
            this.player2.clickPrompt('Left');
            expect(this.brammo.controller).toBe(this.player2.player);
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.play(this.tirelessCrocag);
            this.player1.play(this.gangerChieftain);
            this.player1.clickCard(this.gangerChieftain);
            this.player1.clickCard(this.tirelessCrocag);
            this.player1.clickCard(this.harlandMindlock);
            this.player1.clickPrompt('Left');
            expect(this.harlandMindlock.location).toBe('discard');
            expect(this.tirelessCrocag.location).toBe('discard');
            expect(this.gangerChieftain.location).toBe('play area');
            expect(this.brammo.location).toBe('play area');
            expect(this.brammo.controller).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Own Harland Mindlock's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['brammo'],
                    hand: ['harland-mindlock', 'tireless-crocag']
                },
                player2: {
                    inPlay: ['lamindra', 'gamgee']
                }
            });

            this.player1.play(this.tirelessCrocag);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
        });

        it('should be destroyed when mindlock controlled creature return to opponent', function () {
            this.player1.play(this.harlandMindlock);
            this.player1.clickCard(this.gamgee);
            this.player1.clickPrompt('Left');
            expect(this.gamgee.controller).toBe(this.player1.player);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.lamindra, this.harlandMindlock);
            expect(this.lamindra.location).toBe('discard');
            expect(this.harlandMindlock.location).toBe('discard');
            expect(this.tirelessCrocag.location).toBe('play area');
            expect(this.gamgee.location).toBe('play area');
            expect(this.gamgee.controller).toBe(this.player2.player);
            expect(this.brammo.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe("Gebuk's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['gebuk'],
                    hand: ['gateway-to-dis', 'tireless-crocag']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });

            this.player1.moveCard(this.tirelessCrocag, 'deck');
        });

        it('should be destroyed after put in play', function () {
            this.player1.play(this.gatewayToDis);
            expect(this.lamindra.location).toBe('discard');
            expect(this.gebuk.location).toBe('discard');
            expect(this.tirelessCrocag.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not be destroyed after put in play, if opponent has creature', function () {
            this.lamindra.ward();
            this.player1.play(this.gatewayToDis);
            expect(this.lamindra.location).toBe('play area');
            expect(this.gebuk.location).toBe('discard');
            expect(this.tirelessCrocag.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
