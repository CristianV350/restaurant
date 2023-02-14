import { defineStore } from 'pinia'
import axios from 'axios'
import CategoryService from '../services/CategoryService'

export const useCategoryStore = defineStore('category', {
    state: () => ({
        activeCategory: null,
        categories: []
    }),
    actions: {
        async fetch() {
            let result = await CategoryService.fetch()
            console.log(result)
            if (result.length && !this.activeCategory)
                this.setActiveCategory(result[0].id)
            // await this.fetchIngredients()
            this.categories = result
        },
        async add(data) {
            await axios.post('/api/category', data).then((r) => {
                let category = r.data

                let exists = this.categories.find(
                    (i) => i.name === category.name
                )
                if (!exists) {
                    this.categories.push({ ...category })
                }
            })
        },
        async update({ id, data }) {
            await axios.patch(`/api/category/${id}`, data)
        },
        async delete(id) {
            await axios.post(`/api/category/${id}`)
        },
        async setActiveCategory(id) {
            if (id === this.activeCategory) return
            this.activeCategory = id
            // await this.fetchIngredients()
        }
    }
})
