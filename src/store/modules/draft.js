import clan from "../../api/clan";

const newPowers = () =>{ 
  return {
    assassination:[],
    badInducementDeal:0,
    bloodSacrifice:[],
    emergencyIntensiveCare:0,
    emergencyRnR:[],
    inspiration:[],
    lastMinuteSwitch:0,
    miscommunication:0,
    newBlood:0,
    confusion:0,
    hatredOfPublicTransport:0,
    stuntyHatredOfPublicTransport:0,
    stuntyInspiration:[],
    stuntyLastMinuteSwitch:0,
    stuntyMiscommunication:0,
    stuntyAssassination:[],
    stuntyBadInducementDeal:0,
    stuntyConfusion:0,
    financialFairPlay:0
  }
}

const state = {
  matchup : null,
  leader:false,
  loading:true,
  contests: [
    {awayTeam:null, homeTeam:null},
    {awayTeam:null, homeTeam:null},
    {awayTeam:null, homeTeam:null},
    {awayTeam:null, homeTeam:null},
    {awayTeam:null, homeTeam:null}
  ],
  usedPowers:{
    home:newPowers(),
    away:newPowers()
  },
  original:{
    usedPowers:{},
    contests:{}
  }
}

const compareObjects = (a, b) => { 
  let s = (o) => Object.entries(o).sort().map(i => { 
     if(i[1] instanceof Object) i[1] = s(i[1]);
     return i 
  }) 
  return JSON.stringify(s(a)) === JSON.stringify(s(b))
}

// getters
const getters = {
  awayTeam: state => index => state.contests[index].awayTeam ? state.contests[index].awayTeam.team : null,
  awayTeams: state => () => state.matchup.away.clan.teams,
  homeTeam: state => index => state.contests[index].homeTeam ? state.contests[index].homeTeam.team : null,
  homeTeams: state => () => state.matchup.home.clan.teams,
  used: state => id => state.contests.find(x => (x.homeTeam && x.homeTeam.team.id === id) || (x.awayTeam && x.awayTeam.team.id === id)) ? true : false,
  getPlayers: () => async teamId => await clan.getTeamPlayers(teamId),
  isUnchanged: state => () => {
    return compareObjects(state.contests, state.original.contests) && compareObjects(state.usedPowers, state.original.usedPowers)
  }

}

// actions
const actions = {
  async getMatchup ({commit},payload){
    try{
      let data = await clan.getMatchup(payload);
      commit('setMatchup', data.schedule);
      if(data.leader) commit('setLeader');
    }
    finally{
      commit('setLoadingDone');
    }
  },
  updateContest ({ commit }, payload) {
    commit('updateContest', payload)
  },
  usePower({commit}, payload){
    commit('updatePower', payload)
  },
  unusePower({commit}, payload){
    commit('releasePower', payload)
  },
  save: async ({state}) => await clan.saveContests({ contests: state.contests, powers: state.usedPowers, competition:state.matchup.competition, house:state.matchup.house, round:state.matchup.round, season:state.matchup.season}),
  confirm: async ({state}) => await clan.confirmContests({competition:state.matchup.competition, house:state.matchup.house, round:state.matchup.round, season:state.matchup.season})
}

// mutations
const mutations = {
  setMatchup(state, matchup) {
    if (matchup.contests){
      state.contests = matchup.contests;
      state.original.contests = matchup.contests.map( x=> JSON.parse(JSON.stringify(x))); 
      delete matchup.contests;
    }
    if (matchup.usedPowers){
      Object.assign(state.usedPowers,matchup.usedPowers);
      state.original.usedPowers = JSON.parse(JSON.stringify( matchup.usedPowers));
      delete matchup.usedPowers;
    }

    state.matchup = matchup;

  },
  setLeader(state) {
    state.leader = true;
  }, 
  setLoadingDone(state) {
    state.loading = false;
  },   
  updateContest(state, {contest, team, home}){
    const index = state.contests.indexOf(contest);
    if (home)
      state.contests[index].homeTeam = team ? team.team :null;
    else
      state.contests[index].awayTeam = team ? team.team :null;
  },
  updatePower(state,{power, home, team, player, player2}){
    if (home){
      if (team)
        state.usedPowers.home[power].push({team,player: player || null, player2: player2 || null});
      else
        state.usedPowers.home[power]++;
      state.matchup.home.clan.powers[power]--;
    }
    else{
      if (team)
        state.usedPowers.away[power].push({team,player: player || null, player2: player2 || null});
      else
        state.usedPowers.away[power]++;
      state.matchup.away.clan.powers[power]--;
    }
  },
  releasePower(state,{power, home}){
    if (home){
      if (isNaN(state.usedPowers.home[power]))
        state.usedPowers.home[power].splice(state.usedPowers.home[power].length -1,1);
      else  
        state.usedPowers.home[power]--;
      state.matchup.home.clan.powers[power]++;
    }
    else{
      if (isNaN(state.usedPowers.away[power]))
        state.usedPowers.away[power].splice(state.usedPowers.away[power].length -1,1);
      else  
        state.usedPowers.away[power]--;
      state.matchup.away.clan.powers[power]++;
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}