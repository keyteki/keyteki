const fs = require('fs');
const path = require('path');

const {
    Expansions,
    DeckExpansions,
    compareByRelease
} = require('../../../master-vault-data/src/expansions');
const Constants = require('../../../server/constants');
const { readSqlFiles } = require('../../../server/db/sqlFiles');

const RootPath = path.join(__dirname, '../../..');

// Expansion rows inserted by the baseline and migrations
function getSeededExpansions() {
    const rows = [];
    for (const { sql } of readSqlFiles()) {
        for (const match of sql.matchAll(
            /INSERT INTO (?:public\.)?"Expansions".*VALUES \(\d+, (\d+), '([^']+)', '([^']+)'\)/g
        )) {
            rows.push({ id: parseInt(match[1]), code: match[2], name: match[3] });
        }
    }

    return rows;
}

describe('Expansion registry', function () {
    it('has a unique id for every expansion', function () {
        const ids = Expansions.map((expansion) => expansion.id);

        expect(new Set(ids).size).toBe(ids.length);
    });

    it('adds every expansion to the database exactly once', function () {
        const seeded = getSeededExpansions();

        expect(seeded.map((row) => row.id).sort()).toEqual(Expansions.map((e) => e.id).sort());
        for (const row of seeded) {
            const expansion = Expansions.find((e) => e.id === row.id);
            expect({ id: row.id, code: expansion.code, name: expansion.name }).toEqual(row);
        }
    });

    it('references every pack file exactly once, with the pack listing the expansion first', function () {
        const packFiles = fs.readdirSync(path.join(RootPath, 'master-vault-data/packs')).sort();
        const referenced = Expansions.filter((expansion) => expansion.pack)
            .map((expansion) => expansion.pack)
            .sort();

        expect(referenced).toEqual(packFiles);
        for (const expansion of Expansions.filter((e) => e.pack)) {
            const pack = JSON.parse(
                fs.readFileSync(
                    path.join(RootPath, 'master-vault-data/packs', expansion.pack),
                    'utf8'
                )
            );
            expect(pack.ids[0]).toBe(String(expansion.id));
        }
    });

    it('lists expansions in release order', function () {
        const ids = Expansions.map((expansion) => expansion.id);

        expect([...ids].sort(compareByRelease)).toEqual(ids);
    });

    it('drives the server expansion constants', function () {
        expect(Constants.Expansions.map((expansion) => expansion.id)).toEqual(
            DeckExpansions.map((expansion) => expansion.id)
        );
    });
});
