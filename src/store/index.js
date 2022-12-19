import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    inventory: [],
    activeCeil: {
      id: "a82mzjal2Z",
      item: {
        name: "Item-Green",
        imageSrc: "item-1.svg",
        count: 4,
      },
      position: {
        x: 1,
        y: 1,
      },
    },
  },

  getters: {
    INVENTORY: (state) => {
      return state.inventory;
    },
    ACTIVE_CEIL: (state) => {
      return state.activeCeil;
    },
  },

  mutations: {
    setInventory: (state, payload) => {
      state.inventory = payload;
    },
    setInventoryItem: (state, { index, data }) => {
      state.inventory[index] = data;
    },
    setActiveCeil: (state, payload) => {
      state.activeCeil = payload;
    },
  },

  actions: {
    getInventoryData({ commit, state }) {
      const url = "data/inventory-items.json";

      return axios(url)
        .then((response) => {
          const inventoryItems = response.data.inventory;

          inventoryItems.forEach((item) => {
            const index = state.inventory.findIndex((inventoryCeil) => {
              return (
                inventoryCeil.position.x === item.position.x &&
                inventoryCeil.position.y === item.position.y
              );
            });
            const data = { ...state.inventory[index], ...item };
            commit("setInventoryItem", { index, data });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
});
