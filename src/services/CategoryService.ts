import ClientApi from "./ClientApi"

const url = "category"
const name = "CategoryService"
export default {
    async fetch() {
        const result = await ClientApi(name, "fetch").get(`${url}`)
        if (!(result && result.data && result.statusText === "OK")) return []
        let categories = result.data
        return categories;
    },

    async get(id) {
        const result = await ClientApi(name, "fetch").get(`${url}/${id}`)
        if (!(result && result.data && result.statusText === "OK")) return []
        let category = result.data
        return category;
    },

    async save(jsonObj) {
        if (!jsonObj) return { error: 'Please provide a JSON with the following format { value: jsonValue }.' }
        let result = await ClientApi(name, 'save').post(`${url}`, jsonObj)
        if (!(result && result.data && result.statusText === "OK")) return { error: 'The object could not be saved. Please try again.' }
        return result.data
    }
}
