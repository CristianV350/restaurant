import ClientApi from "./ClientApi"

export default {
    async fetchCategories() {
        const response = await ClientApi("IngredientService", "fetchCategories").get("category")
        // const response = await axios.get("api/category");
        return response.data;
    },

    async createIngredient() {
        const data = { /* your data */ };
        const response = await ClientApi("IngredientService", "createIngredient").post('category', data);
        console.log(response);
    }
}
