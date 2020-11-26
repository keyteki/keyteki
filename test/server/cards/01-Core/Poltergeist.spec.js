describe("Poltergeist's", function () {
    describe("Poltergeist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['poltergeist'],
                    inPlay: ['lifeward']
                },
                player2: {
                    inPlay: ['cannon', 'bumpsy'],
                    hand: ['troll', 'smith']
                }
            });
        });

        it("should allow p1 to use an artifact on p2's board, then destroy it.", function () {
            this.player1.play(this.poltergeist);
            expect(this.player1).toHavePrompt('Choose a artifact');
            expect(this.player1).toBeAbleToSelect(this.cannon);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.cannon);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).not.toBeAbleToSelect(this.cannon);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.bumpsy);
            expect(this.cannon.location).toBe('discard');
            expect(this.bumpsy.tokens.damage).toBe(2);
        });

        it('should allow using own artifact', function () {
            this.player1.play(this.poltergeist);
            expect(this.player1).toHavePrompt('Choose a artifact');
            expect(this.player1).toBeAbleToSelect(this.lifeward);
            this.player1.clickCard(this.lifeward);
            expect(this.lifeward.location).toBe('discard');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.troll);
            expect(this.player2).toHavePromptButton('Discard this card');
            expect(this.player2).not.toHavePromptButton('Play this creature');
        });
    });

    describe("Poltergeist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['poltergeist'],
                    inPlay: ['tentacus']
                },
                player2: {
                    inPlay: ['cannon', 'bumpsy'],
                    amber: 1
                }
            });
        });

        it('should not charge my opponent an amber when I use the artifact and tentacus is in play.', function () {
            this.player1.play(this.poltergeist);
            expect(this.player1).toHavePrompt('Choose a artifact');
            expect(this.player1).toBeAbleToSelect(this.cannon);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.cannon);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).not.toBeAbleToSelect(this.cannon);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.bumpsy);
            expect(this.cannon.location).toBe('discard');
            expect(this.bumpsy.tokens.damage).toBe(2);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });
    });

    describe("Poltergeist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['poltergeist'],
                    discard: ['tocsin', 'batdrone']
                },
                player2: {
                    inPlay: ['cannon', 'bumpsy', 'tentacus'],
                    amber: 1
                }
            });
        });

        it('should charge me an amber when I use the artifact and my opponent has tentacus in play.', function () {
            this.player1.play(this.poltergeist);
            expect(this.player1).toHavePrompt('Choose a artifact');
            expect(this.player1).toBeAbleToSelect(this.cannon);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.tentacus);
            this.player1.clickCard(this.cannon);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).not.toBeAbleToSelect(this.cannon);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.tentacus);
            this.player1.clickCard(this.bumpsy);
            expect(this.cannon.location).toBe('discard');
            expect(this.bumpsy.tokens.damage).toBe(2);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
        });
    });

    describe("Poltergeist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['poltergeist'],
                    inPlay: ['troll', 'gub', 'shooler']
                },
                player2: {
                    inPlay: ['spike-trap', 'bumpsy', 'dendrix', 'malison'],
                    amber: 1
                }
            });
        });

        it('should work with artifacts that sacrifice themselves.', function () {
            this.player1.play(this.poltergeist);
            this.player1.clickCard(this.spikeTrap);
            expect(this.spikeTrap.location).toBe('discard');
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.gub.tokens.damage).toBeUndefined();
            expect(this.shooler.tokens.damage).toBe(3);
            expect(this.bumpsy.tokens.damage).toBe(3);
            expect(this.dendrix.tokens.damage).toBeUndefined();
            expect(this.malison.tokens.damage).toBe(3);
        });
    });

    describe('Poltergeist/The Golden Spiral interaction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['poltergeist', 'dust-imp']
                },
                player2: {
                    inPlay: ['the-golden-spiral', 'questor-jarta'],
                    amber: 1
                }
            });
        });

        it('should cause Spiral to fizzle, then get destroyed', function () {
            this.player1.play(this.poltergeist);
            expect(this.player1).toHavePrompt('Poltergeist');
            expect(this.player1).toBeAbleToSelect(this.theGoldenSpiral);
            this.player1.clickCard(this.theGoldenSpiral);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.theGoldenSpiral.location).toBe('discard');
        });

        it('should cause Spiral to target their creature, then get destroyed', function () {
            this.player1.play(this.dustImp);
            expect(this.dustImp.exhausted).toBe(true);
            this.player1.play(this.poltergeist);
            expect(this.player1).toHavePrompt('Poltergeist');
            expect(this.player1).toBeAbleToSelect(this.theGoldenSpiral);
            this.player1.clickCard(this.theGoldenSpiral);
            expect(this.theGoldenSpiral.location).toBe('play area');
            expect(this.player1).toHavePrompt('The Golden Spiral');
            expect(this.player1).toBeAbleToSelect(this.dustImp);
            expect(this.player1).not.toBeAbleToSelect(this.questorJarta);
            this.player1.clickCard(this.dustImp);
            expect(this.dustImp.exhausted).toBe(false);
            expect(this.dustImp.amber).toBe(1);
            expect(this.player1).toHavePrompt('Dust Imp');
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.theGoldenSpiral.location).toBe('discard');
        });
    });

    describe('Poltergeist/Sneklifter/Domination Bauble interaction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['sneklifter'],
                    inPlay: ['the-golden-spiral', 'questor-jarta']
                },
                player2: {
                    hand: ['poltergeist', 'dust-imp'],
                    inPlay: ['dominator-bauble']
                }
            });

            this.player1.play(this.sneklifter);
            this.player1.clickCard(this.dominatorBauble);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
        });

        it('should cause Domination Bauble to fizzle, then get destroyed', function () {
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            expect(this.dominatorBauble.controller).toBe(this.player1.player);
            this.player2.play(this.poltergeist);
            expect(this.player2).toHavePrompt('Poltergeist');
            expect(this.player2).toBeAbleToSelect(this.dominatorBauble);
            this.player2.clickCard(this.dominatorBauble);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            expect(this.dominatorBauble.location).toBe('discard');
        });

        it('should cause Bauble to target their creature, then get destroyed', function () {
            this.player2.play(this.dustImp);
            this.dustImp.ready();
            expect(this.dustImp.exhausted).toBe(false);
            this.player2.play(this.poltergeist);
            expect(this.player2).toHavePrompt('Poltergeist');
            expect(this.player2).toBeAbleToSelect(this.dominatorBauble);
            this.player2.clickCard(this.dominatorBauble);
            expect(this.dominatorBauble.location).toBe('play area');
            expect(this.player2).toHavePrompt('Dominator Bauble');
            expect(this.player2).toBeAbleToSelect(this.dustImp);
            expect(this.player2).not.toBeAbleToSelect(this.questorJarta);
            this.player2.clickCard(this.dustImp);
            expect(this.player2).toHavePrompt('Dust Imp');
            this.player2.clickPrompt('Reap with this creature');
            expect(this.player2.amber).toBe(2);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            expect(this.dominatorBauble.location).toBe('discard');
        });
    });
});
