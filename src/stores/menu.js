import { defineStore } from 'pinia'
import axios from 'axios'

export const useMenuStore = defineStore("menu", {
  state: () => ({
    activeMenu: null,
    menus:[],
    menu_items:[]
  }),
  actions: {
    async fetchMenus(){
      let result = await axios.get('/api/menu').then((r) => r.data)
      if (!result.length) return
      if (!this.activeGroup) this.setActiveMenu(result[0].id)
      this.menus = result
    },
    async addMenu(data){
        let result = await axios.post('/api/menu', data).then((r) => r.data)
        if (!result.length) return

        let exists = this.menus.find((i) => i.name === result.name);
        if (!exists) {
            state.menus.push({...data});
        }
    },
    async updateMenu(context, payload){
        await axios.put('/api/menu/'+payload.id, payload).then((r) => context.commit('EDIT_MENU', r.data))
    },
    async setActiveMenu(id){
      if (id == this.activeMenu) return
      this.activeMenu = id
      await this.fetchMenuItems()
    },
    async fetchMenuItems(){
        let result = await axios.get('/api/menu-item/' + this.activeMenu).then((r) => r.data)
        if (!result.length) return
        return result.map((item) => {
          console.log(item)
          return {
              id: item.id || null,
              name: item.food.name || '',
              menu_id: this.activeMenu || null,
              food_id: item.food_id || null,
              group_id: item.food.group_id || null,
              price_portion: item.food.price_portion || 0,
              portions: item.portions || 1,
              type: 'food',
          }
      })
    },
    async addMenuItem(data){
        let result = await axios.post('/api/menu-item', data).then((r) => r.data)

        let exists = this.menu_items.find((i) => i.name === result.food.name);
        if (!exists) {
            let result = {...data};
            result.created = true;
            this.menu_items.push({...data});
        }
    },
    async updateMenuItem(data){
        await axios.put('/api/menu-item/'+data.menu_id, data).then((r) => r.data)
    },
    async deleteMenuItem(data){
        await axios.delete('/api/menu-item/'+data.menu_id, data).then((r) => r.data)
    },
  }
})