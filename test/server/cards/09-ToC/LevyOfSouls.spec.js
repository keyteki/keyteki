describe('Levy of Souls', function () {
    describe("Levy of Soul's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    token: 'catena-fiend',
                    inPlay: ['levy-of-souls', 'catena-fiend:toad', 'shooler'],
                    deck: new Array(12).fill('toad')
                },
                player2: {
                    amber: 6,
                    inPlay: ['keyfrog', 'lupo-the-scarred', 'mushroom-man'],
                    hand: ['dust-pixie']
                }
            });

            this.toad1 = this.player1.player.creaturesInPlay[0];
            this.toad2 = this.player1.player.deck[0];

            this.player1.useAction(this.levyOfSouls);
            this.player1.clickPrompt('Left');
        });

        it('should make a token on action', function () {
            expect(this.toad1.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.toad2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should increase key costs next turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.playCreature(this.dustPixie);
            this.player2.fightWith(this.keyfrog, this.toad1);
            this.player2.forgeKey('blue');
            expect(this.player2.amber).toBe(0);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should increase key costs dynamically during turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.playCreature(this.dustPixie);
            this.player2.fightWith(this.lupoTheScarred, this.toad1);
            this.player2.fightWith(this.mushroomMan, this.toad2);
            this.player2.fightWith(this.keyfrog, this.shooler);
            this.player2.forgeKey('blue');
            expect(this.player2.amber).toBe(2);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Levy of Soul's ability used by opponent", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 8,
                    house: 'dis',
                    token: 'catena-fiend',
                    inPlay: ['levy-of-souls']
                },
                player2: {
                    token: 'savant',
                    hand: ['skippy-the-glorious'],
                    deck: new Array(12).fill('toad')
                }
            });
        });
        it('should increase key cost when used by opponent', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.scrap(this.skippyTheGlorious);
            this.player2.clickCard(this.levyOfSouls);
            this.player2.endTurn();

            this.player1.forgeKey('blue');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose which house you want to activate this turn');
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'dis',
                    hand: [],
                    token: 'catena-fiend',
                    inPlay: ['tachyon-manifold', 'levy-of-souls']
                },
                player2: {
                    amber: 7,
                    inPlay: [],
                    hand: []
                }
            });
            this.tachyonManifold.maverick = 'dis';
            this.tachyonManifold.printedHouse = 'dis';
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.useAction(this.levyOfSouls);
            this.player1.endTurn();
            this.player1.clickPrompt('dis');
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('untamed');
            expect(this.player1.player.getCurrentKeyCost()).toBe(7);
            expect(this.player2.player.getCurrentKeyCost()).toBe(7);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
