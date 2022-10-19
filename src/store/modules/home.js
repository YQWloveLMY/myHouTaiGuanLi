// 首页模拟的数据
import mockRequest from "@/utils/mockRequest";
const actions = {
  async getData({ commit }) {
    let result = await mockRequest.get("/home/list");
    if (result.code == 20000) {
      commit("GETDATA", result.data);
    }
  },
};
const mutations = {
  GETDATA(state, value) {
    state.list = value;
  },
};
const state = {
  list: {},
};
const getters = {};

export default {
  actions,
  mutations,
  state,
  getters,
};
