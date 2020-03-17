import clan from "../../api/clan";

const newPowers = () =>{ return {
  assassination:0,
  badInducementDeal:0,
  bloodSacrifice:0,
  confusion:0,
  draftDodgers:0,
  emergencyIntensiveCare:0,
  emergencyRnR:0,
  financialFraudAudit:0,
  hatredOfPubliTransport:0,
  homefieldAdvantage:0,
  inspiration:0,
  lastMinuteSwitch:0,
  miscommunication:0,
  newBlood:0,
  nufflesWill:0
  }}

const state = {
  matchup : null,
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
  }

}

// getters
const getters = {
  awayTeam: state => index => state.contests[index].awayTeam ? state.contests[index].awayTeam.team : null,
  homeTeam: state => index => state.contests[index].homeTeam ? state.contests[index].homeTeam.team : null,
  used: state => id => state.contests.find(x => (x.homeTeam && x.homeTeam.team.id === id) || (x.awayTeam && x.awayTeam.team.id === id)) ? true : false,
}

// actions
const actions = {
  async getMatchup ({commit}){
    let data = await clan.getMatchup();
    commit('setMatchup', data);
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
  save: async ({state}) => await clan.saveContests(state.contests) 
}

// mutations
const mutations = {
  setMatchup(state, matchup) {
    state.matchup = matchup;
  },
  updateContest(state, {contest, team, home}){
    const index = state.contests.indexOf(contest);
    if (home)
      state.contests[index].homeTeam = team.team;
    else
      state.contests[index].awayTeam = team.team;
  },
  updatePower(state,{power, home}){
    if (home){
      state.usedPowers.home[power]++;
      state.matchup.home.clan.powers[power]--;
    }
    else{
      state.usedPowers.away[power]++;
      state.matchup.away.clan.powers[power]--;
    }
  },
  releasePower(state,{power, home}){
    if (home){
      state.usedPowers.home[power]--;
      state.matchup.home.clan.powers[power]++;
    }
    else{
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