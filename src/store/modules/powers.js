import clan from "../../api/clan";

const state = {
  powers : []
}

// getters
const getters = {
  powerName: state => key => state.powers.find(x => x.key === key).name,
  powerDescription: state => key => state.powers.find(x => x.key === key).description,
}

// actions
const actions = {
  async getPowers ({commit}){
    let data = await clan.getPowers();
    commit('setPowers', data);
  }
}

// mutations
const mutations = {
  setPowers (state, powers) {
    state.powers = powers
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}