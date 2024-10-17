describe('The Warchest', function () {
    describe("The Warchest's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['the-warchest', 'troll', 'valdr'],
                    hand: ['punch']
                },
                player2: {
                    inPlay: ['batdrone', 'snufflegator', 'sequis']
                }
            });
        });

        it('should gain amber equal to the number of creatures destroyed in a fight', function () {
            this.player1.fightWith(this.troll, this.snufflegator);
            this.player1.fightWith(this.valdr, this.sequis);
            this.player1.play(this.punch);
            this.player1.clickCard(this.batdrone);
            expect(this.player1.amber).toBe(1);
            expect(this.snufflegator.location).toBe('discard');
            expect(this.sequis.location).toBe('discard');
            expect(this.batdrone.location).toBe('discard');
            this.player1.useAction(this.theWarchest);
            expect(this.player1.amber).toBe(3);
        });
    });

    describe("Interaction with Coward's End", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['dextre'],
                    hand: ['coward-s-end']
                },
                player2: {
                    inPlay: ['krump', 'the-warchest']
                }
            });
        });

        it('should destroy both creatures and not gain amber from warchest', function () {
            this.player1.play(this.cowardSEnd);
            expect(this.player1.amber).toBe(0);
        });
    });

    describe('Interaction with Poltergeist', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: [
                        'stealer-of-souls',
                        'pit-demon',
                        'shooler',
                        'the-warchest',
                        'dust-imp'
                    ],
                    hand: ['poltergeist']
                },
                player2: {
                    inPlay: ['redlock', 'yantzee-gang', 'halacor', 'ancient-bear']
                }
            });
        });

        it('should destroy The Warchest and gain ambers after fighting', function () {
            this.player1.fightWith(this.stealerOfSouls, this.redlock);
            expect(this.stealerOfSouls.tokens.damage).toBe(3);
            expect(this.redlock.location).toBe('purged');
            expect(this.player1.amber).toBe(1);

            this.player1.fightWith(this.pitDemon, this.yantzeeGang);
            expect(this.pitDemon.location).toBe('discard');
            expect(this.yantzeeGang.location).toBe('discard');
            expect(this.player1.amber).toBe(1);

            this.player1.fightWith(this.shooler, this.halacor);
            expect(this.shooler.tokens.damage).toBe(4);
            expect(this.halacor.location).toBe('discard');
            expect(this.player1.amber).toBe(1);

            this.player1.fightWith(this.dustImp, this.ancientBear);
            expect(this.dustImp.location).toBe('discard');
            expect(this.ancientBear.tokens.damage).toBe(2);
            expect(this.player1.amber).toBe(3);

            this.player1.play(this.poltergeist);
            expect(this.player1.amber).toBe(4);

            this.player1.clickCard(this.theWarchest);
            expect(this.theWarchest.location).toBe('discard');
            expect(this.player1.amber).toBe(7);
        });
    });

    describe('When both creatures died in the fight', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['valdr', 'the-warchest'],
                    hand: ['loot-the-bodies']
                },
                player2: {
                    inPlay: ['ganger-chieftain']
                }
            });
            this.valdr.tokens.damage = 4;
        });

        it('should trigger', function () {
            this.player1.fightWith(this.valdr, this.gangerChieftain);
            this.player1.useAction(this.theWarchest);
            expect(this.player1.amber).toBe(1);
        });
    });
});
