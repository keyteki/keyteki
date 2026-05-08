describe('Drecker', function () {
    describe("Drecker's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['snarette', 'drecker'],
                    hand: ['ortannu-s-binding', 'drecker']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll', 'bad-penny']
                }
            });

            this.drecker2 = this.player1.findCardByName('drecker', 'hand');
        });

        describe("when drecker's neighbor is damaged during a fight", function () {
            beforeEach(function () {
                this.player1.fightWith(this.snarette, this.badPenny);
                this.player1.clickCard(this.badPenny);
            });

            it('should do that damage to drecker too', function () {
                expect(this.snarette.damage).toBe(1);
                expect(this.drecker.damage).toBe(1);
            });
        });

        describe("when drecker's neighbor is damaged outside of a fight", function () {
            beforeEach(function () {
                this.player1.play(this.ortannuSBinding);
                this.player1.clickCard(this.snarette);
            });

            it('should not do that damage to drecker too', function () {
                expect(this.snarette.damage).toBe(2);
                expect(this.drecker.damage).toBe(0);
            });
        });

        describe('when drecker reaps', function () {
            beforeEach(function () {
                this.player1.reap(this.drecker);
            });

            it('should steal 1', function () {
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(2);
            });
        });

        describe('when two dreckers are next to each other', function () {
            beforeEach(function () {
                this.player1.play(this.drecker2);
                this.player1.fightWith(this.drecker, this.badPenny);
            });

            it('should duplicate damage once', function () {
                expect(this.drecker.neighbors).toContain(this.drecker2);
                expect(this.drecker.damage).toBe(1);
                expect(this.drecker2.damage).toBe(1);
            });
        });
    });

    describe('Drecker and Armor/Ward', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['snarette', 'drecker', 'drecker', 'gub', 'drecker'],
                    hand: ['protect-the-weak']
                },
                player2: {
                    amber: 3,
                    inPlay: ['abond-the-armorsmith']
                }
            });

            this.drecker = this.player1.inPlay[1];
            this.drecker2 = this.player1.inPlay[2];
            this.drecker3 = this.player1.inPlay[4];
            this.player1.playUpgrade(this.protectTheWeak, this.drecker2);
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
        });

        it('should do the damage to neighbor Drecker after bypassing armor', function () {
            this.player2.fightWith(this.abondTheArmorsmith, this.drecker2);
            expect(this.abondTheArmorsmith.location).toBe('discard');
            expect(this.drecker2.damage).toBe(2);
            expect(this.drecker2.armorUsed).toBe(1);
            expect(this.drecker.damage).toBe(2);
            expect(this.drecker3.damage).toBe(0);
            this.player2.endTurn();
        });

        it('should do the damage to neighbor Drecker regardless of armor', function () {
            this.player2.fightWith(this.abondTheArmorsmith, this.gub);
            this.player2.clickCard(this.drecker2);
            expect(this.abondTheArmorsmith.location).toBe('discard');
            expect(this.gub.damage).toBe(3);
            expect(this.drecker.damage).toBe(0);
            expect(this.drecker2.damage).toBe(3);
            expect(this.drecker2.armorUsed).toBe(0);
            expect(this.drecker3.damage).toBe(3);
            this.player2.endTurn();
        });

        it('should do the damage to neighbor Drecker regardless of ward', function () {
            this.drecker3.ward();
            this.player2.fightWith(this.abondTheArmorsmith, this.gub);
            expect(this.player2).toBeAbleToSelect(this.drecker2);
            expect(this.player2).toBeAbleToSelect(this.drecker3);
            this.player2.clickCard(this.drecker2);
            expect(this.abondTheArmorsmith.location).toBe('discard');
            expect(this.gub.damage).toBe(3);
            expect(this.drecker.damage).toBe(0);
            expect(this.drecker2.damage).toBe(3);
            expect(this.drecker2.armorUsed).toBe(0);
            expect(this.drecker3.damage).toBe(3);
            expect(this.drecker3.warded).toBe(true);
            this.player2.endTurn();
        });
    });

    describe('Drecker and Shadow Self', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['snarette', 'drecker', 'drecker', 'gub', 'drecker', 'shadow-self'],
                    hand: ['protect-the-weak']
                },
                player2: {
                    amber: 3,
                    inPlay: ['abond-the-armorsmith']
                }
            });

            this.drecker = this.player1.inPlay[1];
            this.drecker2 = this.player1.inPlay[2];
            this.drecker3 = this.player1.inPlay[4];
            this.player1.playUpgrade(this.protectTheWeak, this.drecker2);
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
        });

        it('should transfer the damage to Shadow Self', function () {
            this.player2.fightWith(this.abondTheArmorsmith, this.gub);
            expect(this.player2).toBeAbleToSelect(this.drecker2);
            expect(this.player2).toBeAbleToSelect(this.drecker3);
            this.player2.clickCard(this.drecker3);
            expect(this.player2).toBeAbleToSelect(this.drecker2);
            expect(this.player2).toBeAbleToSelect(this.shadowSelf);
            this.player2.clickCard(this.drecker2);
            expect(this.abondTheArmorsmith.location).toBe('discard');
            expect(this.gub.damage).toBe(3);
            expect(this.drecker.damage).toBe(0);
            expect(this.drecker2.damage).toBe(3);
            expect(this.drecker2.armorUsed).toBe(0);
            expect(this.drecker3.damage).toBe(0);
            expect(this.shadowSelf.damage).toBe(3);
            this.player2.endTurn();
        });
    });

    describe('Drecker with Soulkeeper', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'dis',
                    inPlay: ['charette', 'drecker'],
                    hand: ['soulkeeper']
                },
                player2: {
                    inPlay: ['dodger']
                }
            });

            this.player1.playUpgrade(this.soulkeeper, this.drecker);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
        });

        it('if destroyed due to applied damage, SK should destroy the attacker', function () {
            this.player2.fightWith(this.dodger, this.charette);
            expect(this.player2).toBeAbleToSelect(this.dodger);
            this.player2.clickCard(this.dodger);
            expect(this.charette.location).toBe('discard');
            expect(this.drecker.location).toBe('discard');
            expect(this.soulkeeper.location).toBe('discard');
            expect(this.dodger.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(0);
            this.player2.endTurn();
        });

        it('if warded, but destroyed due to applied damage, SK should destroy the attacker', function () {
            this.drecker.ward();
            this.player2.fightWith(this.dodger, this.charette);
            expect(this.player2).toBeAbleToSelect(this.dodger);
            this.player2.clickCard(this.dodger);
            expect(this.charette.location).toBe('discard');
            expect(this.drecker.location).toBe('discard');
            expect(this.soulkeeper.location).toBe('discard');
            expect(this.dodger.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(0);
            this.player2.endTurn();
        });
    });
});
