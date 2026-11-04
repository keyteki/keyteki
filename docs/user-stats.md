# User Stats

Each player can see their own stats for any calendar month on the Stats page (`/stats`, in the profile menu). Stats are private: the API only returns the logged-in user's own stats.

## What is counted

-   **Games:** finished games with a winner, started in the month (UTC). Every game type and format counts, including sealed games and mirror matches, as these are the player's own stats rather than a deck's.
-   **Dominant wins:** the same rule as [deck records](deck-records.md): a win by keys or concession, after 3+ turns, with the opponent on 0 keys. The rule is in [DominantWin.js](../server/services/DominantWin.js), used by user stats and Wrapped; the `DeckStats` view repeats it in SQL, and [DominantWin.spec.js](../test/server/DominantWin.spec.js) fails if the two differ.
-   **Hours played:** time from start to finish, capped at 3 hours per game so a game left open doesn't count as hours of play.
-   **Win streak:** the longest run of wins within the month. Streaks don't carry across months.
-   **Fastest win:** the fewest turns taken to win by forging keys. Wins by concession don't count.
-   **Decks:** grouped by Master Vault id (`GamePlayers."DeckUuid"`), so a deck that was deleted and re-imported is one deck. Decks without one (alliance decks) are grouped by deck id. A deck deleted before the deck id was stored on games shows as "Deleted deck".
-   **Opponents:** opponents whose account is disabled (deleted accounts are anonymised and disabled, and banned accounts are disabled) are left out of the opponent list, rival, nemesis and fastest win, but their games still count towards the totals. Summaries keep opponents by user id, and `UserStatsService.withOpponentNames()` names them each time stats are read, so a cached month or Wrapped snapshot never shows the name of an account deleted or banned since.
-   **Rates:** win and dominant-win percentages are only shown from 5 games, as for deck records.

### In-game stats

The "In the game" section comes from `GamePlayers."Stats"`, recorded by [GameStats.js](../server/game/GameStats.js) from 11 October 2026. Games before then, and games where manual mode was used, are left out of this section, and the page says how many of the month's games it covers.

## How it works

| Piece                            | Location                                                                                                                                                                         |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Query and summary                | [UserStatsService.js](../server/services/UserStatsService.js): `getGameRows()` selects one row per game, `summarise()` builds the stats from them                                |
| Cache for months that have ended | `UserMonthlyStats` table in [schema.sql](../server/db/schema.sql)                                                                                                                |
| API                              | `GET /api/stats/monthly?month=YYYY-MM` in [stats.js](../server/api/stats.js); without `month` it returns the latest month with games. Also returns the list of months with games |
| Page                             | [Stats.jsx](../client/pages/Stats.jsx), [MonthlyStats.jsx](../client/Components/Stats/MonthlyStats.jsx)                                                                          |

The API only accepts months the player has games in. A month is cached the first time it is viewed once it has been over for a day (games can finish after midnight). The current month is always worked out live. The cache row stores `SummaryVersion`; bump it in `UserStatsService.js` whenever the summary changes, and old rows are recomputed when next viewed.

All dates are UTC: the server works out days, weekdays and hours in SQL, so they don't depend on the server's timezone, and the client formats them as UTC. Game times are stored as UTC in `timestamp without time zone` columns: games finished on a game node arrive as ISO strings, and `GameService` turns any `Date` into one too, as node-pg would otherwise send it in the server's local time.

## Wrapped

Once a year each player gets a "Wrapped" report of their year on Keyteki, shown to players as **The Archon's Chronicle** (the code still calls it Wrapped). It is a snapshot, worked out by a script rather than live, because it compares each player with everyone else.

-   **Who gets one:** players with 10+ finished games in the period whose account isn't disabled.
-   **Period:** 1 January up to the day the script runs (or `--to`), so it can go out in mid-December. The snapshot stores `from` and `to`, and the page shows them.
-   **Contents:** everything in the monthly stats for the period, plus:
    -   `byMonth`: games per month
    -   `startTimes`: games by month and UTC quarter of an hour, so the page can show the time of day in the viewer's timezone using each month's own offset
    -   `topDeck`: the most played deck with its houses and expansion id (none if the deck has since been deleted)
    -   `keysConceded`: keys opponents forged in the player's games
    -   `sets`: expansion ids of the decks played, with games for each, most played first
    -   `favouriteHouse`: the house chosen most in game (`source: 'chosen'`), or if the player has no in-game stats, the house in the most games' decks (`source: 'decks'`)
    -   `ranks`: where the player's games, wins, win rate and dominant wins rank among everyone with a Wrapped, as "top N%" (1 is the top; ties share the better rank)
    -   `site`: games and players across Keyteki in the period, the most chosen house, `detailedFrom`, the first day with in-game stats, so the page can say "since 11 October", and `averages`, per game averages of some in-game stats across the site
    -   `title`: the player's Archon title (`key`, `house`, `name`, `count`), from the in-game stat furthest above the site's average (5+ games with in-game stats, compared in standard deviations so rare and common stats are fair), a high share of dominant wins, or else "Seasoned Archon" ([ArchonTitle.js](../server/services/ArchonTitle.js)). It's worked out on the server so the email can use it; the page has its own words for each `key` so they can be translated
-   **One at a time:** each player only has one Wrapped. It can be seen, and is emailed, for two months after it was generated (`AvailableForSql`); after that the page says it is no longer available. Generating everyone's for a year deletes earlier years' snapshots.
-   **Access:** the page is `/chronicle/:year` (`/wrapped/:year` still works), which isn't linked from any menu. It needs a login, and logged-out visitors are sent to `/login?return=/chronicle/:year` and back. `GET /api/wrapped/:year` returns only the logged-in player's own snapshot.
-   **The story:** one card at a time in a 9:16 frame (tap or arrow keys to move). Cards are left out when there's no data for them, and cards built from in-game stats say "Since <date>" when those stats don't cover the whole period. The time-of-day card uses the viewer's own timezone, since "Shadows by night" in UTC would be wrong for most players ([localHours.js](../client/Components/Wrapped/localHours.js)). The page only shows snapshots made by the current `WrappedVersion`; after changing it, run the script again.
-   **Sharing:** "Share this card" renders the frame to a 1080×1920 PNG with `html-to-image`. On touch devices it opens the share sheet; elsewhere (or if the browser refuses) it downloads. Everything drawn into the image has to come from this site, which is why the MVP card art uses `/img/cards/<id>.png` rather than the Master Vault image.

```sh
# Report what would be generated, and print one snapshot
npm run wrapped -- --year 2026

# Generate just your own, to check it on the page
npm run wrapped -- --year 2026 --user <username> --apply

# Generate everyone's, up to and including 14 December
npm run wrapped -- --year 2026 --to 2026-12-15 --apply
```

Running it again replaces the snapshots but keeps `EmailedAt`, so nobody is emailed twice.

| Piece    | Location                                                                                                                                                                                                                                                                    |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Snapshot | [WrappedService.js](../server/services/WrappedService.js): `buildWrapped()` adds the extras to `summarise()`, `rankPlayers()` works out the ranks                                                                                                                           |
| Script   | [wrapped.js](../server/scripts/wrapped.js)                                                                                                                                                                                                                                  |
| Table    | `UserWrapped` in [schema.sql](../server/db/schema.sql)                                                                                                                                                                                                                      |
| API      | `GET /api/wrapped/:year` in [stats.js](../server/api/stats.js)                                                                                                                                                                                                              |
| Page     | [Wrapped.jsx](../client/pages/Wrapped.jsx), [WrappedStory.jsx](../client/Components/Wrapped/WrappedStory.jsx), the cards in [useWrappedCards.jsx](../client/Components/Wrapped/useWrappedCards.jsx), sharing in [shareCard.js](../client/Components/Wrapped/shareCard.js)   |
| Email    | [WrappedEmailService.js](../server/services/WrappedEmailService.js), the setting in [ProfileMain.jsx](../client/Components/Profile/ProfileMain.jsx), unsubscribing in [Unsubscribe.jsx](../client/pages/Unsubscribe.jsx) and [unsubscribe.js](../server/api/unsubscribe.js) |

### The Wrapped email

`npm run wrapped -- --email` tells each player their Wrapped is ready, with a link to `/wrapped/:year`. It's sent with `EmailService`, as HTML with a plain text version.

-   **Who gets it:** players with a current-version snapshot for the year that hasn't expired and who haven't been emailed it, whose account is verified and not disabled, and who haven't turned off "Email me occasional updates" (`Users."Settings_EmailUpdates"`, on by default, in the Account section of the profile).
-   **Unsubscribing:** the footer links to `/unsubscribe?id=&token=`, which asks before turning emails off, as link checkers open links in emails. The email also has `List-Unsubscribe` and `List-Unsubscribe-Post` headers, so mail clients can unsubscribe in one click by POSTing to `/api/unsubscribe`. The token is an HMAC of the user id with `lobby.hmacSecret`, so it never expires and can't be guessed. Account emails (activation, password reset) are always sent.
-   **Sending:** one at a time, at most `--per-second` (default 10, under the default SES rate of 14 a second). `EmailedAt` is set after each successful send, so if the run stops, running it again carries on with the players not emailed yet. A failed send is logged and retried next run.
-   **Logo:** loaded from `public/email/tco-logo.png` (a copy of the site header logo), as the built client's assets have hashed names that change with each build.
-   **Needs:** `lobby.publicUrl`, `lobby.hmacSecret` and the SES settings (`emailFrom`, `awsSesRegion`, and credentials).

```sh
# Count who would be emailed, and save one email to look at in a browser
npm run wrapped -- --year 2026 --email --preview wrapped-email.html

# Email just yourself, then everyone not emailed yet
npm run wrapped -- --year 2026 --email --user <username> --apply
npm run wrapped -- --year 2026 --email --apply
```

### Sending it in December

1. Deploy.
2. `npm run wrapped -- --year 2026 --to <tomorrow>` to check the counts and a sample snapshot.
3. Generate your own with `--user <username> --apply` and look at `/wrapped/2026`.
4. Generate everyone's with `--apply`.
5. Check the email with `--email --preview`, then send it to yourself with `--email --user <username> --apply`.
6. Send everyone's with `--email --apply`.
