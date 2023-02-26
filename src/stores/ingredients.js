import { defineStore } from 'pinia'
import axios from 'axios'
import IngredientService from '../services/CategoryService'

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
        ingredients: []
    }),
    actions: {
        async fetch() {
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
        async getByCategory(id) {
            if (!id) return []
            let result = await axios
                .get('/api/ingredient/' + id)
                .then((r) => r.data)
            this.ingredients = result.map((item) => {
                return {
                    ...item,
                    type: 'ingredient',
                    created: true
                }
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
    }
})
