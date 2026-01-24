describe('Menu Commands', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: ['logos'],
                hand: ['titan-mechanic', 'hunting-witch', 'lamindra'],
                inPlay: ['niffle-ape'],
                discard: ['ancient-bear']
            },
            player2: {
                inPlay: ['batdrone'],
                hand: ['dextre']
            }
        });

        this.game.manualMode = true;
    });

    describe('exhaust', function () {
        it('player 1 can exhaust/ready a creature', function () {
            this.player1.menuClick(this.niffleApe, 'exhaust');
            expect(this.niffleApe.exhausted).toBe(true);
            this.player1.menuClick(this.niffleApe, 'exhaust');
            expect(this.niffleApe.exhausted).toBe(false);
        });

        it('player 2 can exhaust/ready a creature', function () {
            this.player2.menuClick(this.batdrone, 'exhaust');
            expect(this.batdrone.exhausted).toBe(true);
            this.player2.menuClick(this.batdrone, 'exhaust');
            expect(this.batdrone.exhausted).toBe(false);
        });
    });

    describe('stun', function () {
        it('player 1 can stun/unstun a creature', function () {
            this.player1.menuClick(this.niffleApe, 'stun');
            expect(this.niffleApe.stunned).toBe(true);
            this.player1.menuClick(this.niffleApe, 'stun');
            expect(this.niffleApe.stunned).toBe(false);
        });

        it('player 2 can stun/unstun a creature', function () {
            this.player2.menuClick(this.batdrone, 'stun');
            expect(this.batdrone.stunned).toBe(true);
            this.player2.menuClick(this.batdrone, 'stun');
            expect(this.batdrone.stunned).toBe(false);
        });
    });

    describe('enrage', function () {
        it('player 1 can enrage/unenrage a creature', function () {
            this.player1.menuClick(this.niffleApe, 'enrage');
            expect(this.niffleApe.enraged).toBe(true);
            this.player1.menuClick(this.niffleApe, 'enrage');
            expect(this.niffleApe.enraged).toBe(false);
        });

        it('player 2 can enrage/unenrage a creature', function () {
            this.player2.menuClick(this.batdrone, 'enrage');
            expect(this.batdrone.enraged).toBe(true);
            this.player2.menuClick(this.batdrone, 'enrage');
            expect(this.batdrone.enraged).toBe(false);
        });
    });

    describe('ward', function () {
        it('player 1 can ward/unward a creature', function () {
            this.player1.menuClick(this.niffleApe, 'ward');
            expect(this.niffleApe.warded).toBe(true);
            this.player1.menuClick(this.niffleApe, 'ward');
            expect(this.niffleApe.warded).toBe(false);
        });

        it('player 2 can ward/unward a creature', function () {
            this.player2.menuClick(this.batdrone, 'ward');
            expect(this.batdrone.warded).toBe(true);
            this.player2.menuClick(this.batdrone, 'ward');
            expect(this.batdrone.warded).toBe(false);
        });
    });

    describe('damage', function () {
        it('player 1 can add and remove damage tokens from a creature', function () {
            this.player1.menuClick(this.niffleApe, 'addDamage');
            this.player1.menuClick(this.niffleApe, 'addDamage');
            expect(this.niffleApe.damage).toBe(2);
            this.player1.menuClick(this.niffleApe, 'remDamage');
            expect(this.niffleApe.damage).toBe(1);
        });

        it('player 2 can add and remove damage tokens from a creature', function () {
            this.player2.menuClick(this.batdrone, 'addDamage');
            expect(this.batdrone.damage).toBe(1);
            this.player2.menuClick(this.batdrone, 'remDamage');
            expect(this.niffleApe.damage).toBe(0);
        });
    });

    describe('power', function () {
        it('player 1 can add and remove power tokens from a creature', function () {
            this.player1.menuClick(this.niffleApe, 'addPower');
            this.player1.menuClick(this.niffleApe, 'addPower');
            expect(this.niffleApe.tokens.power).toBe(2);
            this.player1.menuClick(this.niffleApe, 'remPower');
            expect(this.niffleApe.tokens.power).toBe(1);
        });

        it('player 2 can add and remove power tokens from a creature', function () {
            this.player2.menuClick(this.batdrone, 'addPower');
            expect(this.batdrone.tokens.power).toBe(1);
            this.player2.menuClick(this.batdrone, 'remPower');
            expect(this.niffleApe.tokens.power).toBeUndefined();
        });
    });

    describe('amber', function () {
        it('player 1 can add and remove amber tokens from a creature', function () {
            this.player1.menuClick(this.niffleApe, 'addAmber');
            this.player1.menuClick(this.niffleApe, 'addAmber');
            expect(this.niffleApe.amber).toBe(2);
            this.player1.menuClick(this.niffleApe, 'remAmber');
            expect(this.niffleApe.amber).toBe(1);
        });

        it('player 2 can add and remove power tokens from a creature', function () {
            this.player2.menuClick(this.batdrone, 'addAmber');
            expect(this.batdrone.amber).toBe(1);
            this.player2.menuClick(this.batdrone, 'remAmber');
            expect(this.niffleApe.amber).toBe(0);
        });
    });

    describe('control', function () {
        describe('during player 1 turn', function () {
            it('player 1 should be able to give control of own creature', function () {
                this.player1.menuClick(this.niffleApe, 'control');
                expect(this.player1).toHavePromptButton('Left');
                expect(this.player1).toHavePromptButton('Right');
                this.player1.clickPrompt('Left');
                expect(this.player1.inPlay).not.toContain(this.niffleApe);
                expect(this.player2.inPlay).toContain(this.niffleApe);
                expect(this.niffleApe.controller).toBe(this.player2.player);
                expect(this.player1).isReadyToTakeAction();
                expect(this.player2).toHavePrompt('Waiting for opponent');
            });

            it('player 2 should be able to give control of own creature', function () {
                this.player2.menuClick(this.batdrone, 'control');
                expect(this.player2).toHavePromptButton('Left');
                expect(this.player2).toHavePromptButton('Right');
                this.player2.clickPrompt('Left');
                expect(this.player1.inPlay).toContain(this.batdrone);
                expect(this.player2.inPlay).not.toContain(this.batdrone);
                expect(this.batdrone.controller).toBe(this.player1.player);
                expect(this.player1).isReadyToTakeAction();
                expect(this.player2).toHavePrompt('Waiting for opponent');
            });
        });

        describe('during player 2 turn', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('logos');
            });

            it('player 1 should be able to give control of own creature', function () {
                this.player1.menuClick(this.niffleApe, 'control');
                expect(this.player1).toHavePromptButton('Left');
                expect(this.player1).toHavePromptButton('Right');
                this.player1.clickPrompt('Left');
                expect(this.player1.inPlay).not.toContain(this.niffleApe);
                expect(this.player2.inPlay).toContain(this.niffleApe);
                expect(this.niffleApe.controller).toBe(this.player2.player);
                expect(this.player2).isReadyToTakeAction();
                expect(this.player1).toHavePrompt('Waiting for opponent');
            });

            it('player 2 should be able to give control of own creature', function () {
                this.player2.menuClick(this.batdrone, 'control');
                expect(this.player2).toHavePromptButton('Left');
                expect(this.player2).toHavePromptButton('Right');
                this.player2.clickPrompt('Left');
                expect(this.player1.inPlay).toContain(this.batdrone);
                expect(this.player2.inPlay).not.toContain(this.batdrone);
                expect(this.batdrone.controller).toBe(this.player1.player);
                expect(this.player2).isReadyToTakeAction();
                expect(this.player1).toHavePrompt('Waiting for opponent');
            });
        });
    });
});
