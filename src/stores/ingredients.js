import { defineStore } from 'pinia'
import axios from 'axios'
import IngredientService from '../services/IngredientService'

const modelIngredient = {
    name: '',
    price: 0,
    purchase_price: 0,
    measure: 'kg',
    portions: 0,
    type: 'ingredient',
    edited: false
}

export const useIngredientStore = defineStore('ingredients', {
    state: () => ({
        activeCategory: null,
        categories: [],
        ingredients: [{ ...modelIngredient }]
    }),
    actions: {
        async fetchIngredients() {
            if (!this.activeCategory) return []
            return await axios
                .get('/api/ingredient/' + this.activeCategory)
                .then((r) => {
                    let result = r.data
                    this.ingredients = result.map((item) => {
                        return {
                            ...item,
                            type: 'ingredient',
                            created: true
                        }
                    })
                })
        },
        async addIngredient(data) {
            await axios.post('/api/ingredient', data).then((r) => {
                if (r.status !== 200) {
                    console.error(r.error)
                    return
                }

                let result = r.data
                let exists = this.ingredients.find(
                    (i) => i.name === result.name
                )
                if (!exists) {
                    let ingredient = { ...result }
                    ingredient.created = true
                    this.ingredients.push({ ...ingredient })
                }
            })
        },
        async updateIngredient({ id, data }) {
            await axios.patch(`/api/ingredient/${id}`, data).then((r) => {
                if (r.status !== 200) {
                    console.error(r.error)
                    return
                }
            })
        },
        async deleteIngredient({ id }) {
            await axios.delete(`/api/ingredient/${id}`)
        },
        async fetchCategories() {
            let result = await IngredientService.fetchCategories()
            if (result.length && !this.activeCategory)
                this.setActiveCategory(result[0].id)
            // await this.fetchIngredients()
            this.categories = result
        },
        async addCategory(data) {
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
        async updateCategory({ id, data }) {
            await axios.patch(`/api/category/${id}`, data)
        },
        async deleteCategory(id) {
            await axios.post(`/api/category/${id}`)
        },
        async setActiveCategory(id) {
            if (id === this.activeCategory) return
            this.activeCategory = id
            // await this.fetchIngredients()
        }
    }
})
