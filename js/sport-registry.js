// ============================================
// Bet Max Tourney - Sport Registry (Single Source of Truth)
// ============================================
//
// One place to teach the site about a new sport. Everything else
// (marquee, tournaments table, pools list, sport pills) calls into
// this registry to resolve a code -> { family, label } and render a
// uniform sport chip.
//
// Adding a new sport:
//   1. If it needs a unique icon, add a new entry to SVG.
//   2. Add an entry to OVERRIDES for code -> { family, label }, OR
//      rely on the prefix fallback in PREFIX_FAMILY.
//   3. Done. No CSS changes, no per-sport class rules.

(function () {
    'use strict';

    // Material Design icon paths. viewBox="0 -960 960 960", fill="currentColor".
    // The chip's CSS color drives the icon color.
    var SVG = {
        football:   "M481.33-481.33ZM368-190.67l-178-178Q183.67-328 185.5-278t9.17 80q27 7.67 79.83 10.67t93.5-3.34Zm81.33-12.66q61-12.34 113-39 52-26.67 90.39-65.05 37.28-37.29 63.61-87.79 26.34-50.5 40.34-114.83L510-756.67q-61 14-112.67 40.5Q345.67-689.67 308-652t-63.5 89.5q-25.83 51.83-41.17 113.17l246 246Zm-72-127.34-46.66-46.66 252-252 46.66 46.66-252 252Zm392.67-260q6.67-41 4.83-91.33-1.83-50.33-9.5-80-27-8-79.83-11t-93.5 3.67l178 178.66ZM300.67-120q-55 0-99-7.83-44-7.84-55-18.52-11-11.65-18.84-55.98Q120-246.67 120-302q0-123 36-228.5T258-702q66-66 171.95-102 105.95-36 229.38-36 55.34 0 99.17 7.83 43.83 7.84 54.83 18.52 11 11.65 18.84 55.98Q840-713.33 840-657.33 840-535 804-429.5 768-324 702-258q-65.67 65.67-171.67 101.83Q424.33-120 300.67-120Z",
        basketball: "M148-513.33h129.33q-6.66-44.67-26.33-84-19.67-39.34-49-68.67-21.33 33-36.17 71.17Q151-556.67 148-513.33Zm534.67 0H812q-3-43.34-17.83-81.5Q779.33-633 758-666q-31.33 31.33-50 69.67-18.67 38.33-25.33 83ZM202-294.67Q233.33-326 252-364t25.33-82.67H148q3 43.34 17.83 81.17 14.84 37.83 36.17 70.83Zm556 0q21.33-33 36.17-70.83Q809-403.33 812-446.67H682.67Q689.33-402 708-364q18.67 38 50 69.33ZM345.33-513.33h101.34V-812q-59 7.33-109.84 31.17-50.83 23.83-91.5 63.5 40.34 40 66.17 92.16 25.83 52.17 33.83 111.84Zm168 0h101.34q8-59.67 34.16-111.84 26.17-52.16 66.5-92.16-40.66-39.67-91.83-63.5-51.17-23.84-110.17-31.17v298.67ZM446.67-148v-298.67H345.33q-8 59.67-33.83 111.5-25.83 51.84-66.17 91.84 40.67 39.66 89.84 63.83 49.16 24.17 111.5 31.5Zm66.66 0q62.34-7.33 111.84-31.5t90.16-63.83q-40.33-40-66.5-91.84-26.16-51.83-34.16-111.5H513.33V-148ZM480-476.67ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z",
        baseball:   "M218-272q49-36.33 76.17-91.67Q321.33-419 321.33-480t-27.16-116.67q-27.17-55.66-76.17-92-35.67 44.67-53.5 98-17.83 53.34-17.83 110.67t17.83 110.33q17.83 53 53.5 97.67Zm262 125.33q59.67 0 114.5-18.83t100.83-57.83q-58.33-47.34-90.5-114.84-32.16-67.5-32.16-141.83 0-74.33 32.16-142.17Q637-690 695.33-737.33q-46-38.34-100.83-57.17T480-813.33q-59.67 0-114.5 18.83t-100.83 57.17Q323-690 355.5-622.17 388-554.33 388-480q0 74.33-32.5 141.83-32.5 67.5-90.83 114.84 46 39 100.83 57.83T480-146.67ZM742.67-272q35.66-44.67 53.16-97.67T813.33-480q0-57.33-17.5-110.67-17.5-53.33-53.16-98-49 36.34-76.17 92Q639.33-541 639.33-480t27.17 116.33q27.17 55.34 76.17 91.67ZM480-480Zm0 400q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-155.67 31.5-72.66 85.83-127Q251.67-817 324.67-848.5T480-880q83 0 155.67 31.5 72.66 31.5 127 85.83 54.33 54.34 85.83 127Q880-563 880-480q0 82.33-31.5 155.33-31.5 73-85.83 127.34-54.34 54.33-127 85.83Q563-80 480-80Z",
        hockey:     "M80-160v-96.67q0-17.66 11.17-28.83 11.16-11.17 28.83-11.17h26.67V-160H80Zm109.33 0v-136.67h170l40-88.66 54 111.33-42 92.67q-5 11-14.66 16.16Q387-160 375.33-160h-186Zm624 0v-136.67H840q17.67 0 28.83 11.17Q880-274.33 880-256.67V-160h-66.67Zm-42.66 0h-186q-11.67 0-21.34-5.17-9.66-5.16-14.66-16.16L266.67-800h106.66L480-564l106.67-236h106.66L532.67-446.67l68 150h170V-160Z",
        soccer:     "M480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-155.67 31.5-72.66 85.83-127Q251.67-817 324.67-848.5T480-880q83 0 155.67 31.5 72.66 31.5 127 85.83 54.33 54.34 85.83 127Q880-563 880-480q0 82.33-31.5 155.33-31.5 73-85.83 127.34-54.34 54.33-127 85.83Q563-80 480-80Zm203.33-495.33 64-22L764.67-658q-33.34-51.33-81.67-87.83t-108.33-55.5L513.33-760v65.33l170 119.34Zm-406 0 169.34-119.34V-760L386-801.33q-60 19-108.33 55.5Q229.33-709.33 196-658l20 60.67 61.33 22Zm-50 316 55.34-6 36-61.34L258-512l-66-22.67-45.33 36q0 69.67 16.66 127.17 16.67 57.5 64 112.17ZM480-146.67q26.67 0 53.33-4.66Q560-156 588-164l31.33-68-30-51.33h-218l-30 51.33 31.34 68q25.33 8 53 12.67 27.66 4.66 54.33 4.66ZM379.33-350H578l59.33-175.33-157.33-112-158.67 112 58 175.33Zm354 90.67Q780-314 796.67-371.5q16.66-57.5 16.66-127.17L768-530l-65.33 18L642-326.67l35.33 61.34 56 6Z",
        boxing:     "M320-120q-17.67 0-28.83-11.17Q280-142.33 280-160v-103.33h400V-160q0 17.67-11.17 28.83Q657.67-120 640-120H320Zm440-523.33v124.66q0 5.67-1.33 8.67L728-360.67q-3.67 17.34-16.17 27.67-12.5 10.33-29.83 10.33H278q-17.33 0-29.83-10.33T232-360.67L201.33-510q-1.33-3-1.33-8.67v-254.66q0-28.34 19.17-47.5Q238.33-840 266.67-840H620q28.33 0 47.5 19.17 19.17 19.16 19.17 47.5v130q0-16.34 10.16-26.5Q707-680 723.33-680q16.34 0 26.5 10.17Q760-659.67 760-643.33Zm-465.33 254h370.66l28-143.34v-32.66H620v-208H266.67v240.66l28 143.34Zm35.33-176h226.67v-129.34H330v129.34Zm150-16Z",
        rugby:      "M301.33-100q-61 0-105.66-11-44.67-11-60.34-27-16-15.67-25.66-60Q100-242.33 100-304q0-115 40.83-221.5Q181.67-632 255.33-708q69.67-75 178.5-113.5Q542.67-860 662.67-860 723-860 768-850t60 24.67q15.33 13.66 23.67 56.66 8.33 43 8.33 109.34 0 117.66-39.83 224.16Q780.33-328.67 708-255.33q-73.67 75.66-181.83 115.5Q418-100 301.33-100Z",
        // Multi-sport whistle (from bma_tournament_core sport-icon__Multi)
        multi:      "M440-200q-100 0-170-70t-70-170q0-11 1-22t3-22q-5 2-12 3t-12 1q-42 0-71-29t-29-71 27.5-71 69.5-29q33 0 59.5 18.5T274-614q33-30 75.5-48t90.5-18h440v160H680v80q0 100-70 170t-170 70M180-540q17 0 28.5-11.5T220-580t-11.5-28.5T180-620t-28.5 11.5T140-580t11.5 28.5T180-540m260 240q58 0 99-41t41-99-41-99-99-41-99 41-41 99 41 99 99 41m0-60q33 0 56.5-23.5T520-440t-23.5-56.5T440-520t-56.5 23.5T360-440t23.5 56.5T440-360"
    };

    // Per-code overrides: full RSS sport code -> { family, label }
    var OVERRIDES = {
        'americanfootball_nfl':       { family: 'football',   label: 'NFL' },
        'americanfootball_ncaaf':     { family: 'football',   label: 'NCAAF' },
        'americanfootball_cfl':       { family: 'football',   label: 'CFL' },
        'basketball_nba':             { family: 'basketball', label: 'NBA' },
        'basketball_ncaab':           { family: 'basketball', label: 'NCAAB' },
        'basketball_wnba':            { family: 'basketball', label: 'WNBA' },
        'baseball_mlb':               { family: 'baseball',   label: 'MLB' },
        'baseball_npb':               { family: 'baseball',   label: 'NPB' },
        'icehockey_nhl':              { family: 'hockey',     label: 'NHL' },
        'mma_mixed_martial_arts':     { family: 'boxing',     label: 'MMA' },
        'boxing_boxing':              { family: 'boxing',     label: 'BOXING' },
        'soccer_epl':                 { family: 'soccer',     label: 'EPL' },
        'soccer_uefa_champs_league':  { family: 'soccer',     label: 'UCL' },
        'soccer_uefa_europa_league':  { family: 'soccer',     label: 'UEL' },
        'soccer_uefa':                { family: 'soccer',     label: 'UEFA' },
        'soccer_mls':                 { family: 'soccer',     label: 'MLS' },
        'soccer_spain_la_liga':       { family: 'soccer',     label: 'LA LIGA' },
        'soccer_germany_bundesliga':  { family: 'soccer',     label: 'BUNDESLIGA' },
        'soccer_italy_serie_a':       { family: 'soccer',     label: 'SERIE A' },
        'soccer_france_ligue_one':    { family: 'soccer',     label: 'LIGUE 1' },
        'australianfootball_afl':     { family: 'football',   label: 'AFL' },
        'rugbyleague_nrl':            { family: 'rugby',      label: 'NRL' }
    };

    // Friendly aliases for static HTML use (`data-sport-icon="NFL"`).
    // Maps short alias -> RSS code (or family pseudo-code).
    var ALIASES = {
        NFL:    'americanfootball_nfl',
        NCAAF:  'americanfootball_ncaaf',
        CFL:    'americanfootball_cfl',
        AFL:    'australianfootball_afl',
        NBA:    'basketball_nba',
        NCAAB:  'basketball_ncaab',
        WNBA:   'basketball_wnba',
        MLB:    'baseball_mlb',
        NPB:    'baseball_npb',
        NHL:    'icehockey_nhl',
        MMA:    'mma_mixed_martial_arts',
        BOXING: 'boxing_boxing',
        EPL:    'soccer_epl',
        UEFA:   'soccer_uefa',
        UCL:    'soccer_uefa_champs_league',
        UEL:    'soccer_uefa_europa_league',
        MLS:    'soccer_mls',
        SERIEA:     'soccer_italy_serie_a',
        LIGUE1:     'soccer_france_ligue_one',
        BUNDESLIGA: 'soccer_germany_bundesliga',
        NRL:    'rugbyleague_nrl'
    };

    // Family pseudo-codes for UI tokens that don't represent a specific league.
    var FAMILY_TOKENS = {
        SOCCER: { family: 'soccer',     label: 'SOCCER' },
        SPORTS: { family: 'multi',      label: 'SPORTS' },
        MULTI:  { family: 'multi',      label: 'MULTI-SPORT' }
    };

    // Prefix-based fallback. Order matters for ambiguous prefixes;
    // longest-first so 'australianfootball_' beats 'football' etc.
    var PREFIX_FAMILY = [
        ['australianfootball_', 'football'],
        ['americanfootball_',   'football'],
        ['rugbyleague_',        'rugby'],
        ['rugbyunion_',         'rugby'],
        ['basketball_',         'basketball'],
        ['baseball_',           'baseball'],
        ['icehockey_',          'hockey'],
        ['hockey_',             'hockey'],
        ['soccer_',             'soccer'],
        ['football_',           'soccer'], // some feeds use 'football_' for soccer
        ['mma_',                'boxing'],
        ['boxing_',             'boxing'],
        ['cricket_',            'multi'],
        ['tennis_',             'multi'],
        ['golf_',               'multi']
    ];

    function deriveLabel(prefix, code) {
        return code.slice(prefix.length).replace(/_/g, ' ').toUpperCase();
    }

    // Resolve any input (RSS code, alias, family token) -> { family, label }.
    // Returns null only for empty input.
    function resolve(input) {
        if (input == null) return null;
        var raw = String(input).trim();
        if (!raw) return null;

        var upper = raw.toUpperCase();
        if (FAMILY_TOKENS[upper]) {
            return { family: FAMILY_TOKENS[upper].family, label: FAMILY_TOKENS[upper].label };
        }
        if (ALIASES[upper]) {
            raw = ALIASES[upper];
        }

        var code = raw.toLowerCase();
        if (OVERRIDES[code]) {
            return { family: OVERRIDES[code].family, label: OVERRIDES[code].label };
        }

        for (var i = 0; i < PREFIX_FAMILY.length; i++) {
            var prefix = PREFIX_FAMILY[i][0];
            var family = PREFIX_FAMILY[i][1];
            if (code.indexOf(prefix) === 0) {
                return { family: family, label: deriveLabel(prefix, code) };
            }
        }

        // Last resort: unknown sport -> multi-sport whistle, label = code uppercased.
        return { family: 'multi', label: code.replace(/_/g, ' ').toUpperCase() };
    }

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderIconSvg(family) {
        var path = SVG[family] || SVG.multi;
        return '<svg class="sport-chip__icon" xmlns="http://www.w3.org/2000/svg"' +
            ' viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true">' +
            '<path d="' + path + '"/></svg>';
    }

    // Build a chip HTML string. opts:
    //   label: false  -> icon only
    //   labelOverride -> use this string instead of resolved label
    //   variant       -> 'marquee' | 'row' | 'pill' (CSS class suffix)
    //   className     -> extra class names appended to the wrapper
    function renderChip(input, opts) {
        opts = opts || {};
        var r = resolve(input);
        if (!r) return '';
        var classes = ['sport-chip'];
        if (opts.variant) classes.push('sport-chip--' + opts.variant);
        if (opts.className) classes.push(opts.className);
        var labelText = opts.labelOverride != null ? opts.labelOverride : r.label;
        var labelHtml = (opts.label === false) ? '' :
            '<span class="sport-chip__label">' + escapeHtml(labelText) + '</span>';
        return '<span class="' + classes.join(' ') + '" data-sport-family="' + r.family + '">' +
            renderIconSvg(r.family) + labelHtml + '</span>';
    }

    function renderIcon(input, opts) {
        opts = opts || {};
        opts.label = false;
        return renderChip(input, opts);
    }

    // Hydrate any element with [data-sport-icon] by injecting an inline
    // icon SVG. By default the element is also turned into a chip wrapper
    // (gets `.sport-chip` class).
    // Optional attributes:
    //   data-sport-label="UCL"   -> append a label span after the icon
    //   data-sport-variant="row" -> add .sport-chip--row class
    //   data-sport-bare           -> skip adding `.sport-chip`; inject SVG only
    //                                (use when the host element controls layout
    //                                 itself, e.g. homepage `.sport-card .sport-icon`).
    function hydrate(root) {
        root = root || document;
        var nodes = root.querySelectorAll('[data-sport-icon]:not([data-sport-hydrated])');
        nodes.forEach(function (el) {
            var code = el.getAttribute('data-sport-icon');
            var r = resolve(code);
            if (!r) return;
            var labelOverride = el.getAttribute('data-sport-label');
            var variant = el.getAttribute('data-sport-variant');
            var bare = el.hasAttribute('data-sport-bare');
            if (!bare) el.classList.add('sport-chip');
            if (!bare && variant) el.classList.add('sport-chip--' + variant);
            el.setAttribute('data-sport-family', r.family);
            el.setAttribute('data-sport-hydrated', '1');
            var inner = renderIconSvg(r.family);
            if (!bare && labelOverride !== null) {
                inner += '<span class="sport-chip__label">' + escapeHtml(labelOverride || r.label) + '</span>';
            }
            el.innerHTML = inner;
        });
    }

    // Title-based inference for tournaments without an explicit sport code.
    // Returns an alias string the renderer understands, or null.
    function inferFromTitle(title) {
        if (!title) return null;
        var t = String(title).toLowerCase();
        if (t.indexOf('hoop') >= 0 || t.indexOf('basketball') >= 0 || t.indexOf('nba') >= 0) return 'NBA';
        if (t.indexOf('football') >= 0 || t.indexOf('nfl') >= 0) return 'NFL';
        if (t.indexOf('baseball') >= 0 || t.indexOf('mlb') >= 0) return 'MLB';
        if (t.indexOf('hockey') >= 0 || t.indexOf('nhl') >= 0) return 'NHL';
        if (t.indexOf('epl') >= 0 || t.indexOf('uefa') >= 0 || t.indexOf('soccer') >= 0) return 'SOCCER';
        if (t.indexOf('college') >= 0 || t.indexOf('ncaa') >= 0) return 'NCAAF';
        if (t.indexOf('boxing') >= 0 || t.indexOf('boxer') >= 0) return 'BOXING';
        if (t.indexOf('mma') >= 0 || t.indexOf('ufc') >= 0 || t.indexOf('mixed martial') >= 0) return 'MMA';
        return null;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { hydrate(document); });
    } else {
        hydrate(document);
    }

    window.SportRegistry = {
        resolve: resolve,
        renderChip: renderChip,
        renderIcon: renderIcon,
        hydrate: hydrate,
        inferFromTitle: inferFromTitle
    };
})();
