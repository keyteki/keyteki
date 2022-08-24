describe('Hecatomb', function () {
    describe("Hecatomb's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['hecatomb'],
                    amber: 0,
                    inPlay: ['rotgrub', 'ember-imp']
                },
                player2: {
                    amber: 0,
                    inPlay: ['bloodshard-imp']
                }
            });
        });
        it('should award 1 amber for each dis creature destroyed to respective controllers', function () {
            this.player1.play(this.hecatomb);
            expect(this.player1.player.amber).toBe(3);
            expect(this.player2.player.amber).toBe(1);
            expect(this.emberImp.location).toBe('discard');
            expect(this.rotgrub.location).toBe('discard');
            expect(this.bloodshardImp.location).toBe('discard');
        });
    });
    describe('Hecatomb & warded creatures', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['hecatomb'],
                    amber: 0,
                    inPlay: ['rotgrub', 'ember-imp', 'streke']
                },
                player2: {
                    amber: 0,
                    inPlay: ['bloodshard-imp']
                }
            });
        });
        it('should not award amber for warded dis creatures', function () {
            this.emberImp.ward();
            this.rotgrub.ward();
            this.player1.play(this.hecatomb); // gain 1 from aember bonus > gain 1 from Streke being destroyed
            expect(this.player1.player.amber).toBe(2);
            expect(this.player2.player.amber).toBe(1);
            expect(this.emberImp.location).toBe('play area');
            expect(this.rotgrub.location).toBe('play area');
            expect(this.streke.location).toBe('discard');
            expect(this.bloodshardImp.location).toBe('discard');
        });
    });
    describe('Hecatomb & creatures destroyed in other ways', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['hecatomb'],
                    amber: 0,
                    inPlay: ['rotgrub', 'ember-imp', 'harbinger-of-doom']
                },
                player2: {
                    amber: 0,
                    inPlay: ['bloodshard-imp', 'krump', 'bumpsy']
                }
            });
        });
        it('should not award amber for non dis creatures as an aftereffect', function () {
            this.player1.play(this.hecatomb);
            expect(this.player1.player.amber).toBe(4);
            expect(this.player2.player.amber).toBe(1);
            expect(this.emberImp.location).toBe('discard');
            expect(this.rotgrub.location).toBe('discard');
            expect(this.bloodshardImp.location).toBe('discard');
            expect(this.harbingerOfDoom.location).toBe('discard');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
        });
        it('should not award amber for warded dis creatures as an aftereffect', function () {
            this.rotgrub.ward();
            this.emberImp.ward();
            this.player1.play(this.hecatomb); // gain 1 from aember bonus > gain 1 from Harbinger Of Doom being destroyed
            expect(this.player1.player.amber).toBe(2);
            expect(this.player2.player.amber).toBe(1);
            expect(this.emberImp.location).toBe('discard');
            expect(this.rotgrub.location).toBe('discard');
            expect(this.bloodshardImp.location).toBe('discard');
            expect(this.harbingerOfDoom.location).toBe('discard');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
        });
    });
    describe('Hecatomb & destroyed abilities', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['hecatomb'],
                    amber: 1,
                    inPlay: ['rotgrub', 'ember-imp', 'pit-demon', 'streke', 'sinder']
                },
                player2: {
                    amber: 0,
                    inPlay: ['brabble']
                }
            });
        });
        it('destroyed abilities should trigger before the aember gain', function () {
            this.player1.play(this.hecatomb); // gain 1 from aember bonus > lose 3 from Brabble > gain 5 from friendly destroyed Dis creatures
            expect(this.player1.player.amber).toBe(5);
            expect(this.player2.player.amber).toBe(1);
            expect(this.emberImp.location).toBe('discard');
            expect(this.rotgrub.location).toBe('discard');
            expect(this.brabble.location).toBe('discard');
        });
    });
    describe('Hecatomb & creatures that changed controllers', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['hecatomb'],
                    amber: 0,
                    inPlay: ['rotgrub', 'ember-imp']
                },
                player2: {
                    amber: 0,
                    hand: ['collar-of-subordination'],
                    inPlay: ['pit-demon']
                }
            });
        });
        it('destroyed abilities should trigger before the aember gain', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.playUpgrade(this.collarOfSubordination, this.rotgrub);
            this.player2.clickPrompt('Left');
            expect(this.rotgrub.controller).toBe(this.player2.player);
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.play(this.hecatomb); // gain 1 from aember bonus > gain 1 from ember imp
            expect(this.player1.player.amber).toBe(2);
            expect(this.player2.player.amber).toBe(2); // 1 from pit demon, 1 from stolen rotgrub
            expect(this.emberImp.location).toBe('discard');
            expect(this.rotgrub.location).toBe('discard');
            expect(this.pitDemon.location).toBe('discard');
        });
    });
});
