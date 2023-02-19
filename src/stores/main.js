import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({
    /* Mode */
    mode: "edit", // edit, preview, split

    /* User */
    userName: null,
    userEmail: null,
    userAvatar: null,

    /* Field focus with ctrl+k (to register only once) */
    isFieldFocusRegistered: false,

    /* Sample data (commonly used) */
    history: [],
  }),
  actions: {
    setUser(payload) {
      if (payload.name) {
        this.userName = payload.name;
      }
      if (payload.email) {
        this.userEmail = payload.email;
      }
      if (payload.avatar) {
        this.userAvatar = payload.avatar;
      }
    },
    setMode(value) {
      this.mode = value
    }
  },
});
