import clan from "../../api/clan";

const state = {
  matchup : null,
  contests: [
    {awayTeam:null, homeTeam:null},
    {awayTeam:null, homeTeam:null},
    {awayTeam:null, homeTeam:null},
    {awayTeam:null, homeTeam:null},
    {awayTeam:null, homeTeam:null}
  ]

}

// getters
const getters = {
  awayTeam: state => index => state.contests[index].awayTeam ? state.contests[index].awayTeam.team : null,
  homeTeam: state => index => state.contests[index].homeTeam ? state.contests[index].homeTeam.team : null,
  used: state => id => state.contests.find(x => (x.homeTeam && x.homeTeam.team.id === id) || (x.awayTeam && x.awayTeam.team.id === id)) ? true : false
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}