import { defineStore } from 'pinia'
import axios from 'axios'
import CheckpointService from '@/services/CheckpointService'

export const useCheckpointStore = defineStore('checkpoint', {
    state: () => ({
        activeCheckpoint: null,
        checkpoints: []
    }),
    actions: {
        async fetch() {
            let result = await CheckpointService.fetch()
            if (result.error) return
            if (result.length && !this.activeCheckpoint) this.setActiveCheckpoint(result[0].id)
            // await this.fetchIngredients()
            this.checkpoints = result
        },
        async add(checkpoint) {
            let exists = this.checkpoints.find(
                (i) => i.name === checkpoint.name
            )
            if (!exists) {
                this.checkpoints.push({ ...checkpoint })
            }
        },
        async update({ id, data }) {
            await axios.patch(`/api/checkpoint/${id}`, data)
        },
        async delete(id) {
            await axios.post(`/api/checkpoint/${id}`)
        },
        async setActiveCheckpoint(id) {
            if (id === this.activeCheckpoint) return
            this.activeCheckpoint = id
            // await this.fetchIngredients()
        }
    }
})
