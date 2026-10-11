# Master Vault Data

Card data used by The Crucible / keyteki.

-   `expansions.json` lists every expansion keyteki knows about, in release order. It drives the
    expansion lists on the server and client, and the release date decides which printing of a
    card is the latest.
-   `packs/` holds one file per expansion with cards, imported from the Master Vault API.
-   `overrides.json` corrects cards that Master Vault has wrong. Overrides are applied whenever
    cards are imported, so fixes aren't lost when a pack is re-imported. Don't edit pack files by
    hand: add an override with a `reason` instead.

Card ids are derived from card titles by `src/cardId.js`, which deck import also uses.

## Validating

The pack data is checked as part of the keyteki test suite. To check it on its own:

```
npm run validate
```

## Importing from the KeyForge API

Once the pack data is available on the KeyForge website, it can be imported by running:

```
npm run import packs/packFileName.json packcode
# Example: npm run import packs/AoA.json AoA
```

To load a different locale, pass the language code ('en', 'es', 'it', 'de', 'fr', 'pl', 'pt',
'th', 'zh-hans', 'zh-hant'), or `all` to load every language:

```
npm run import packs/AoA.json AoA pt
npm run import packs/AoA.json AoA all
```

English is the default language, and must be loaded first.

## Applying overrides

After adding an override, apply it to the existing pack files with:

```
npm run apply-overrides
```

## Spoiler sources

Before a set is on Master Vault, cards can be loaded from Archon Arcana
(`node scripts/import-aa.js packs/<Pack>.json "<set name>"`) or Decks of KeyForge
(`node scripts/import-dok.js packs/<Pack>.json`).
