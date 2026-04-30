describe('DapperChapeau', function () {
    describe("Dapper Chapeau's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['dapper-chapeau'],
                    inPlay: ['exeldon-yash']
                },
                player2: {
                    inPlay: ['troll', 'urchin']
                }
            });
            this.player1.playUpgrade(this.dapperChapeau, this.exeldonYash);
        });

        it('returns to hand if damage destroys the target', function () {
            this.player1.clickCard(this.exeldonYash);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toBeAbleToSelect(this.exeldonYash);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.dapperChapeau.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('attaches to the damaged creature when it survives', function () {
            this.player1.clickCard(this.exeldonYash);
            this.player1.clickPrompt("Use this card's Action ability");
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('play area');
            expect(this.troll.damage).toBe(4);
            expect(this.troll.upgrades).toContain(this.dapperChapeau);
            expect(this.player1).isReadyToTakeAction();
        });

        it('returns to hand from discard when it destroys its own host', function () {
            this.player1.clickCard(this.exeldonYash);
            this.player1.clickPrompt("Use this card's Action ability");
            this.player1.clickCard(this.exeldonYash);
            expect(this.exeldonYash.location).toBe('discard');
            expect(this.dapperChapeau.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Dapper Chapeau when the host dies but the target survives', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['dapper-chapeau'],
                    inPlay: ['exeldon-yash']
                },
                player2: {
                    inPlay: ['master-of-2', 'urchin', 'soulkeeper', 'friendship']
                }
            });
            this.player1.playUpgrade(this.dapperChapeau, this.exeldonYash);
            // Manually attach Soulkeeper to Master of 2 (a low-power neighbor
            // of Urchin) and Friendship to Urchin (the action target).
            this.masterOf2.upgrades.push(this.soulkeeper);
            this.soulkeeper.parent = this.masterOf2;
            this.urchin.upgrades.push(this.friendship);
            this.friendship.parent = this.urchin;
            this.game.checkGameState(true);
        });

        it('returns Dapper Chapeau to hand when the host dies as collateral', function () {
            this.player1.clickCard(this.exeldonYash);
            this.player1.clickPrompt("Use this card's Action ability");
            // Targeting Urchin (which has Friendship) redirects all 4 damage
            // to its only neighbor Master of 2, destroying it. Soulkeeper on
            // Master of 2 then prompts to destroy the most powerful enemy
            // creature -- Exeldon Yash, the host of Dapper Chapeau.
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.exeldonYash);
            expect(this.urchin.location).toBe('play area');
            expect(this.masterOf2.location).toBe('discard');
            expect(this.exeldonYash.location).toBe('discard');
            expect(this.dapperChapeau.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Dapper Chapeau when both the host and the target die', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['dapper-chapeau'],
                    inPlay: ['exeldon-yash', 'soulkeeper']
                },
                player2: {
                    inPlay: ['master-of-2', 'urchin', 'soulkeeper', 'friendship']
                }
            });
            this.player1.playUpgrade(this.dapperChapeau, this.exeldonYash);
            const hostSoulkeeper = this.player1.findCardByName('Soulkeeper', 'play area');
            const enemySoulkeeper = this.player2.findCardByName('Soulkeeper', 'play area');
            this.exeldonYash.upgrades.push(hostSoulkeeper);
            hostSoulkeeper.parent = this.exeldonYash;
            this.masterOf2.upgrades.push(enemySoulkeeper);
            enemySoulkeeper.parent = this.masterOf2;
            this.urchin.upgrades.push(this.friendship);
            this.friendship.parent = this.urchin;
            this.game.checkGameState(true);
        });

        it('leaves Dapper Chapeau in the discard pile', function () {
            this.player1.clickCard(this.exeldonYash);
            this.player1.clickPrompt("Use this card's Action ability");
            // Damage to Urchin is redirected by Friendship to Master of 2,
            // destroying it. The Soulkeeper on Master of 2 then destroys
            // Exeldon Yash (the host). The Soulkeeper on Exeldon Yash then
            // destroys Urchin (the target). Urchin's destruction is by
            // a destroy effect, not by the dealt damage, so Dapper Chapeau
            // stays in the discard.
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.exeldonYash);
            this.player1.clickCard(this.urchin);
            expect(this.masterOf2.location).toBe('discard');
            expect(this.exeldonYash.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
            expect(this.dapperChapeau.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
