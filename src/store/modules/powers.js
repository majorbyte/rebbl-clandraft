import clan from "../../api/clan";

const state = {
  powers : []
}

// getters
const getters = {
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