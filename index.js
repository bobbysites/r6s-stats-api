const Stats = require('./src/stats/stats');
const Fetch = require('./src/fetch');
const rankImg = require('./src/fetch/modules/rankimg');
const checkPlatform = require('./src/fetch/modules/checkplatform');
const checkNumber = require('./src/fetch/modules/checknumber');


let stats_general = new Stats.dataGeneral();
let stats_casual = new Stats.dataCasual();
let stats_rank = new Stats.dataRank();
// let stats_unrank = new Stats.dataUnrank(); // Deprecated unrank.
let stats_deathmatch = new Stats.dataDeathmatch();
let stats_operator = new Stats.dataOperator();


const API_ERROR = `If you see this error, it means it's an API error, please report this error on Github.`;

const time_played_regex = /(\d{1,3}),(\d{1,3})h/

module.exports = {
    general: async function (platform, name) {
        if (typeof platform !== 'string' || typeof name !== 'string') return 'FORMAT_ERROR';
        if (!checkPlatform(platform.toLowerCase())) return 'PLATFORM_ERROR';

        let url = `https://r6.tracker.network/profile/${platform.toLowerCase()}/${name}/`;
        let track = await Fetch.general(url);

        if (track[0] === 'error') return 'NOT_FOUND';
        if (track[0] === 'timeout') return 'TIME_OUT';

        let header = track[0];
        let level = track[1];
        let profile = track[2];

        if (typeof (profile) === 'undefined') throw new Error(API_ERROR);


        // stats_general.url = url;
        stats_general.username = name;
        stats_general.avatar= header;

        stats_general.level = checkNumber(level[level.indexOf('Level') + 1]);

        stats_general.kd = checkNumber(profile[profile.indexOf('KD') + 1]);
        stats_general.kills = checkNumber(level[level.indexOf('Kills') + 1]);
        stats_general.deaths = checkNumber(profile[profile.indexOf('Deaths') + 1]);
        stats_general.win_percent = checkNumber(profile[profile.indexOf('Win %') + 1]);
        stats_general.wins = checkNumber(profile[profile.indexOf('Wins') + 1]);
        stats_general.losses = checkNumber(profile[profile.indexOf('Losses') + 1]);

        stats_general.headshot_percent = checkNumber(profile[profile.indexOf('Headshot %') + 1]);
        stats_general.headshots = checkNumber(profile[profile.indexOf('Headshots') + 1]);

        const time_played = profile[profile.indexOf('Time Played') + 1];
        stats_general.time_played = time_played.match(time_played_regex)? time_played: null;
        stats_general.matches_played = checkNumber(profile[profile.indexOf('Matches Played') + 1]);
        stats_general.total_xp = checkNumber(profile[profile.indexOf('Total XP') + 1]);
        stats_general.melee_kills = checkNumber(profile[profile.indexOf('Melee Kills') + 1]);
        stats_general.blind_kills = checkNumber(profile[profile.indexOf('Blind Kills') + 1]);

        return stats_general;
    },

    casual: async function (platform, name) {
        if (typeof platform !== 'string' || typeof name !== 'string') return 'FORMAT_ERROR';
        if (!checkPlatform(platform.toLowerCase())) return 'PLATFORM_ERROR';

        let url = `https://r6.tracker.network/profile/${platform.toLowerCase()}/${name}/`;
        let track = await Fetch.casual(url);

        if (track[0] === 'error') return 'NOT_FOUND';
        if (track[0] === 'timeout') return 'TIME_OUT';

        let header = track[0];
        let rank = track[1];
        let profile = track[2];

        if (typeof (profile) === 'undefined') throw new Error(API_ERROR);


        // stats_casual.url = url;
        stats_casual.username = name;
        stats_casual.avatar= header;

        stats_casual.kd = checkNumber(profile[profile.indexOf('KD') + 1]);
        stats_casual.kills = checkNumber(profile[profile.indexOf('Kills') + 1]);
        stats_casual.deaths = checkNumber(profile[profile.indexOf('Deaths') + 1]);

        stats_casual.win_percent = checkNumber(profile[profile.indexOf('Win %') + 1]);
        stats_casual.wins = checkNumber(profile[profile.indexOf('Wins') + 1]);
        stats_casual.losses = checkNumber(profile[profile.indexOf('Losses') + 1]);

        const time_played = profile[profile.indexOf('Time Played') + 1];
        stats_casual.time_played = time_played.match(time_played_regex)? time_played: null;
        stats_casual.matches = checkNumber(profile[profile.indexOf('Matches') + 1]);
        stats_casual.kills_match = checkNumber(profile[profile.indexOf('Kills/match') + 1]);
        stats_casual.kills_min = checkNumber(profile[profile.indexOf('Kills/min') + 1]);

        stats_casual.mmr = typeof (rank?.indexOf('Rank Points')) === 'undefined' ? 0 : checkNumber(rank[rank.indexOf('Rank Points') + 1]);
        const _rank = rank[rank.indexOf('Rank') + 1];
        stats_casual.rank = typeof (rank?.indexOf('Rank')) === 'undefined' || _rank === '-' ? 'UNRANKED' : _rank;
        stats_casual.rank_img = rankImg(stats_casual.rank);

        return stats_casual;
    },

    rank: async function (platform, name) {
        if (typeof platform !== 'string' || typeof name !== 'string') return 'FORMAT_ERROR';
        if (!checkPlatform(platform.toLowerCase())) return 'PLATFORM_ERROR';

        let url = `https://r6.tracker.network/profile/${platform.toLowerCase()}/${name}/`;
        let track = await Fetch.rank(url);

        if (track[0] === 'error') return 'NOT_FOUND';
        if (track[0] === 'timeout') return 'TIME_OUT';

        let header = track[0];
        let rank = track[1];
        let profile = track[2];

        if (typeof (profile) === 'undefined') throw new Error(API_ERROR);


        // stats_rank.url = url;
        stats_rank.username = name;
        stats_rank.avatar= header;

        stats_rank.kd = checkNumber(profile[profile.indexOf('KD') + 1]);
        stats_rank.kills = checkNumber(profile[profile.indexOf('Kills') + 1]);
        stats_rank.deaths = checkNumber(profile[profile.indexOf('Deaths') + 1]);
        stats_rank.win_percent = checkNumber(profile[profile.indexOf('Win %') + 1]);
        stats_rank.wins = checkNumber(profile[profile.indexOf('Wins') + 1]);
        stats_rank.losses = checkNumber(profile[profile.indexOf('Losses') + 1]);

        const time_played = profile[profile.indexOf('Time Played') + 1];
        stats_rank.time_played = time_played.match(time_played_regex)? time_played: null;
        stats_rank.matches = checkNumber(profile[profile.indexOf('Matches') + 1]);
        stats_rank.kills_match = checkNumber(profile[profile.indexOf('Kills/match') + 1]);
        stats_rank.kills_min = checkNumber(profile[profile.indexOf('Kills/min') + 1]);

        stats_rank.mmr = typeof (rank?.indexOf('Rank Points')) === 'undefined' ? 0 : checkNumber(rank[rank.indexOf('Rank Points') + 1]);
        const _rank = typeof (rank?.indexOf('Rank')) === 'undefined'? 'undefined': rank[rank.indexOf('Rank') + 1];
        stats_casual.rank = _rank === 'undefined' || _rank === '-' ? 'UNRANKED' : _rank;        stats_rank.rank_img = rankImg(stats_rank.rank);

        return stats_rank;
    },

    /* Deprecated unrank.
    unrank: async function (platform, name) {
      if (typeof (platform) !== "string" || typeof (name) !== "string") return "FORMAT_ERROR";
      if (!chechPlatform(platform.toLowerCase())) return "PLATFORM_ERROR";
  
      let url = `https://r6.tracker.network/profile/${platform.toLowerCase()}/${name}/`;
      let track = await Fetch.unrank(url);
  
      if (track[0] === "error")
        return "NOT_FOUND";
  
      if (track[0] === "timeout")
        return "TIME_OUT";
  
      let header = track[0];
      let profile = track[1];
  
  
  
      stats_unrank.url = url;
      stats_unrank.username = name;
      stats_unrank.avatar= header;
  
      stats_unrank.kd = profile[profile.indexOf('KD') + 1];
      stats_unrank.kills = profile[profile.indexOf('Kills') + 1];
      stats_unrank.deaths = profile[profile.indexOf('Deaths') + 1];
      stats_unrank.win_percent = profile[profile.indexOf('Win %') + 1];
      stats_unrank.wins = profile[profile.indexOf('Wins') + 1];
      stats_unrank.losses = profile[profile.indexOf('Losses') + 1];
  
      stats_unrank.time_played = profile[profile.indexOf('Time Played') + 1];
      stats_unrank.matches = profile[profile.indexOf('Matches') + 1];
      stats_unrank.kills_match = profile[profile.indexOf('Kills/match') + 1];
      stats_unrank.kills_min = profile[profile.indexOf('Kills/min') + 1];
  
      return stats_unrank;
    },
  */

    deathmatch: async function (platform, name) {
        if (typeof platform !== 'string' || typeof name !== 'string') return 'FORMAT_ERROR';
        if (!checkPlatform(platform.toLowerCase())) return 'PLATFORM_ERROR';

        let url = `https://r6.tracker.network/profile/${platform.toLowerCase()}/${name}/`;
        let track = await Fetch.deathmatch(url);

        if (track[0] === 'error') return 'NOT_FOUND';
        if (track[0] === 'timeout') return 'TIME_OUT';

        let header = track[0];
        let rank = track[1];
        let profile = track[1];

        if (typeof (profile) === 'undefined') return 'NEVER_PLAY';

        // stats_deathmatch.url = url;
        stats_deathmatch.username = name;
        stats_deathmatch.avatar= header;

        stats_deathmatch.kd = checkNumber(profile[profile.indexOf('K/D') + 1]);
        stats_deathmatch.kills = checkNumber(profile[profile.indexOf('Kills') + 1]);
        stats_deathmatch.deaths = checkNumber(profile[profile.indexOf('Deaths') + 1]);
        stats_deathmatch.win_percent = checkNumber(profile[profile.indexOf('Win %') + 1]);
        stats_deathmatch.wins = checkNumber(profile[profile.indexOf('Wins') + 1]);
        stats_deathmatch.losses = checkNumber(profile[profile.indexOf('Losses') + 1]);

        stats_deathmatch.abandons = checkNumber(profile[profile.indexOf('Abandons') + 1]);
        stats_deathmatch.matches = parseInt(stats_deathmatch.wins) + parseInt(stats_deathmatch.losses) + parseInt(stats_deathmatch.abandons);
        stats_deathmatch.kills_match = checkNumber(profile[profile.indexOf('Kills/Match') + 1]);

        stats_deathmatch.mmr = typeof (rank?.indexOf('Rank Points')) === 'undefined' ? 0: checkNumber(rank[rank.indexOf('Rank Points') + 1]);
        const _rank = rank[rank.indexOf('Rank') + 1];
        stats_casual.rank = typeof (rank?.indexOf('Rank')) === 'undefined' || _rank === '-' ? 'UNRANKED' : _rank;
        stats_deathmatch.rank_img = rankImg(stats_deathmatch.rank);

        return stats_deathmatch;
    },

    operator: async function (platform, name, operator) {
        if (typeof platform !== 'string' || typeof name !== 'string') return 'FORMAT_ERROR';
        if (!checkPlatform(platform.toLowerCase())) return 'PLATFORM_ERROR';

        let url = `https://r6.tracker.network/profile/${platform.toLowerCase()}/${name}/operators`;
        let track = await Fetch.operator(url, operator.toUpperCase());

        if (track[0] === 'error') return 'NOT_FOUND';
        if (track[0] === 'timeout') return 'TIME_OUT';
        if (track[0] === 'operator_error') return 'OPERATOR_ERROR';

        let header = track[0];
        let operator_img = track[1];
        let board = track[2];
        let profile = track[3];

        if (typeof (profile) === 'undefined') throw new Error(API_ERROR);


        // stats_operator.url = url;
        stats_operator.username = name;
        stats_operator.avatar= header;

        stats_operator.operator = profile[board.indexOf('Operator ')];

        stats_operator.kd = checkNumber(profile[board.indexOf('K/D')]);
        stats_operator.kills = checkNumber(profile[board.indexOf('Kills')]);
        stats_operator.deaths = checkNumber(profile[board.indexOf('Deaths')]);
        stats_operator.win_percent = checkNumber(profile[board.indexOf('Win %')]);
        stats_operator.wins = checkNumber(profile[board.indexOf('Wins')]);
        stats_operator.losses = checkNumber(profile[board.indexOf('Losses')]);

        stats_operator.headshots_ = checkNumber(profile[board.indexOf('Headshot %')]);

        const time_played = profile[profile.indexOf('Time Played') + 1];
        stats_operator.time_played = time_played.match(time_played_regex)? time_played: null;
        stats_operator.dbnos = profile[board.indexOf('DBNOs')];
        stats_operator.xp = profile[board.indexOf('XP')];
        stats_operator.melee_kills = checkNumber(profile[board.indexOf('Melee Kills')]);
        stats_operator.operator_stat = profile[board.indexOf('Operator Stat')];
        stats_operator.operator_img = operator_img;

        return stats_operator;
    },
};
