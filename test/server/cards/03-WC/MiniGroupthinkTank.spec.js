describe('Mini Groupthink Tank', function () {
    describe("Mini Groupthink Tank's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['lamindra', 'dextre', 'groupthink-tank'],
                    hand: ['mini-groupthink-tank', 'experimental-therapy']
                },
                player2: {
                    amber: 3,
                    inPlay: ['spyyyder', 'shooler', 'gub', 'skullion', 'archimedes', 'zorg']
                }
            });
        });

        it('should play and deal damage to an enemy creature with 2 neighbors sharing the same house', function () {
            this.player1.playCreature(this.miniGroupthinkTank);

            expect(this.player1).toHavePrompt('Mini Groupthink Tank');

            expect(this.player1).toBeAbleToSelect(this.groupthinkTank);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.gub);

            expect(this.player1).not.toBeAbleToSelect(this.miniGroupthinkTank);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.spyyyder);
            expect(this.player1).not.toBeAbleToSelect(this.skullion);
            expect(this.player1).not.toBeAbleToSelect(this.archimedes);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);

            this.player1.clickCard(this.gub);

            expect(this.gub.location).toBe('discard');
        });

        it('should play and deal damage to a friendly creature with 2 neighbors sharing the same house', function () {
            this.player1.playCreature(this.miniGroupthinkTank);

            expect(this.player1).toHavePrompt('Mini Groupthink Tank');

            expect(this.player1).toBeAbleToSelect(this.groupthinkTank);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.gub);

            expect(this.player1).not.toBeAbleToSelect(this.miniGroupthinkTank);
            expect(this.player1).not.toBeAbleToSelect(this.spyyyder);
            expect(this.player1).not.toBeAbleToSelect(this.skullion);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.archimedes);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);

            this.player1.clickCard(this.groupthinkTank);

            expect(this.groupthinkTank.location).toBe('discard');
        });

        it('should be affected by experimental therapy', function () {
            this.player1.playUpgrade(this.experimentalTherapy, this.lamindra);
            this.player1.playCreature(this.miniGroupthinkTank);

            expect(this.player1).toHavePrompt('Mini Groupthink Tank');

            expect(this.player1).toBeAbleToSelect(this.groupthinkTank);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.dextre);

            expect(this.player1).not.toBeAbleToSelect(this.miniGroupthinkTank);
            expect(this.player1).not.toBeAbleToSelect(this.spyyyder);
            expect(this.player1).not.toBeAbleToSelect(this.skullion);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.archimedes);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);

            this.player1.clickCard(this.dextre);

            expect(this.dextre.location).toBe('deck');
        });
    });

    describe("Mini Groupthink Tank's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['lamindra', 'dextre', 'groupthink-tank', 'mini-groupthink-tank']
                },
                player2: {
                    amber: 3,
                    inPlay: ['spyyyder', 'shooler', 'gub', 'skullion', 'archimedes', 'zorg']
                }
            });
        });

        it('should reap and deal damage to a creature with 2 neighbors sharing the same house', function () {
            this.player1.reap(this.miniGroupthinkTank);

            expect(this.player1).toHavePrompt('Mini Groupthink Tank');

            expect(this.player1).toBeAbleToSelect(this.groupthinkTank);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.gub);

            expect(this.player1).not.toBeAbleToSelect(this.miniGroupthinkTank);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.spyyyder);
            expect(this.player1).not.toBeAbleToSelect(this.skullion);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);
            expect(this.player1).not.toBeAbleToSelect(this.archimedes);

            this.player1.clickCard(this.gub);

            expect(this.gub.location).toBe('discard');
        });
    });

    describe("Mini Groupthink Tank's fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['lamindra', 'dextre', 'groupthink-tank', 'mini-groupthink-tank']
                },
                player2: {
                    amber: 3,
                    inPlay: ['spyyyder', 'shooler', 'gub', 'skullion', 'archimedes', 'zorg']
                }
            });
        });

        it('should fight and deal damage to a creature with 2 neighbors sharing the same house', function () {
            this.player1.fightWith(this.miniGroupthinkTank, this.archimedes);

            expect(this.player1).toHavePrompt('Mini Groupthink Tank');

            expect(this.player1).toBeAbleToSelect(this.groupthinkTank);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.gub);

            expect(this.player1).not.toBeAbleToSelect(this.miniGroupthinkTank);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.spyyyder);
            expect(this.player1).not.toBeAbleToSelect(this.skullion);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);
            expect(this.player1).not.toBeAbleToSelect(this.archimedes);

            this.player1.clickCard(this.gub);

            expect(this.gub.location).toBe('discard');
        });
    });
});
