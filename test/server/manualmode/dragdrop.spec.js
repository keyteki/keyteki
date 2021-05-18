describe('Drag and drop card', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: ['logos'],
                hand: ['titan-mechanic', 'hunting-witch', 'lamindra', 'duskrunner', 'tide-warp'],
                inPlay: ['niffle-ape'],
                discard: ['ancient-bear']
            },
            player2: {
                inPlay: ['batdrone', 'archimedes'],
                hand: ['dextre']
            }
        });

        this.game.manualMode = true;
    });

    it('player1 should be able to drag from play area to hand', function () {
        expect(this.niffleApe.location).toBe('play area');
        this.player1.drop(this.niffleApe, 'hand');
        expect(this.niffleApe.location).toBe('hand');
    });

    it('player2 should be able to drag from play area to hand', function () {
        expect(this.batdrone.location).toBe('play area');
        this.player2.drop(this.batdrone, 'hand');
        expect(this.batdrone.location).toBe('hand');
    });

    it('player1 should be able to drag a creature from hand to play area at left flank', function () {
        expect(this.titanMechanic.location).toBe('hand');
        this.player1.drop(this.titanMechanic, 'play area');
        expect(this.player1).toHavePromptButton('Left');
        expect(this.player1).toHavePromptButton('Right');
        this.player1.clickPrompt('Left');
        expect(this.titanMechanic.location).toBe('play area');
    });

    it('player1 should be able to drag a creature from hand to play area at right flank', function () {
        expect(this.titanMechanic.location).toBe('hand');
        this.player1.drop(this.titanMechanic, 'play area');
        expect(this.player1).toHavePromptButton('Left');
        expect(this.player1).toHavePromptButton('Right');
        this.player1.clickPrompt('Left');
        expect(this.titanMechanic.location).toBe('play area');
    });

    it("player2 should be able to drag a creature from hand to play area at a creature's right flank", function () {
        expect(this.dextre.location).toBe('hand');
        this.player2.drop(this.dextre, 'play area');
        expect(this.player2).toHavePromptButton('Left');
        expect(this.player2).toHavePromptButton('Right');
        expect(this.player2).toHavePromptButton('Deploy Left');
        expect(this.player2).toHavePromptButton('Deploy Right');
        this.player2.clickPrompt('Deploy Right');
        expect(this.player2).toBeAbleToSelect(this.batdrone);
        expect(this.player2).toBeAbleToSelect(this.archimedes);
        this.player2.clickCard(this.batdrone);
        expect(this.dextre.location).toBe('play area');
        expect(this.dextre.neighbors[0]).toBe(this.batdrone);
        expect(this.dextre.neighbors[1]).toBe(this.archimedes);
    });

    it("player2 should be able to drag a creature from hand to play area at a creature's left flank", function () {
        expect(this.dextre.location).toBe('hand');
        this.player2.drop(this.dextre, 'play area');
        expect(this.player2).toHavePromptButton('Left');
        expect(this.player2).toHavePromptButton('Right');
        expect(this.player2).toHavePromptButton('Deploy Left');
        expect(this.player2).toHavePromptButton('Deploy Right');
        this.player2.clickPrompt('Deploy Left');
        expect(this.player2).toBeAbleToSelect(this.batdrone);
        expect(this.player2).toBeAbleToSelect(this.archimedes);
        this.player2.clickCard(this.archimedes);
        expect(this.dextre.location).toBe('play area');
        expect(this.dextre.neighbors[0]).toBe(this.batdrone);
        expect(this.dextre.neighbors[1]).toBe(this.archimedes);
    });

    it('player1 should be able to drag an artifact from hand to play area', function () {
        expect(this.tideWarp.location).toBe('hand');
        this.player1.drop(this.tideWarp, 'play area');
        expect(this.tideWarp.location).toBe('play area');
    });

    it('player1 should be able to drag an artifact from hand to play area', function () {
        expect(this.tideWarp.location).toBe('hand');
        this.player1.drop(this.tideWarp, 'play area');
        expect(this.tideWarp.location).toBe('play area');
    });

    it('player1 should be able to drag an upgrade from hand to play area', function () {
        expect(this.duskrunner.location).toBe('hand');
        this.player1.drop(this.duskrunner, 'play area');
        expect(this.player1).toBeAbleToSelect(this.niffleApe);
        expect(this.player1).toBeAbleToSelect(this.batdrone);
        expect(this.player1).toBeAbleToSelect(this.archimedes);
        this.player1.clickCard(this.niffleApe);
        expect(this.duskrunner.location).toBe('play area');
        expect(this.duskrunner.parent).toBe(this.niffleApe);
    });
});
