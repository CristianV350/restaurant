<template>
    <div id="categories">
        <h2>Categories</h2>
        <div id="categories-list">
            <dataTable
                type="category"
                :loading="loading"
                :key="categoryRows"
                :item-id="category"
                :model="modelCategory"
                :data="categoryRows"
                @addAction="store.addCategory"
                @updateAction="store.updateCategory"
                @deleteAction="store.deleteCategory"
                @category="setActiveCategory"
            ></dataTable>
        </div>
    </div>
    <div id="ingredients">
        <h2>Ingredients</h2>
        <div id="ingredient-list" v-if="categoryRows[0].created">
            <dataTable
                type="ingredient"
                :loading="loading"
                :key="ingredients"
                :item-id="category"
                :model="modelIngredient"
                :data="ingredients"
                @addAction="store.addIngredient"
                @updateAction="store.updateIngredient"
                @deleteAction="store.deleteIngredient"
            ></dataTable>
        </div>
    </div>
</template>

<script>
    import {defineComponent, ref, computed, watch, onMounted} from 'vue';
    import { useIngredientStore } from '../store/ingredients'
    import dataTable from '../components/dataTable.vue';
    import { useSharedStore } from '../store/shared';
    import { storeToRefs } from 'pinia';

    const modelCategory = {
        name: '',
        type: 'category',
        edited: false
    }

    const modelIngredient = {
        name: '',
        price: 0,
        purchase_price:0,
        measure: 'kg',
        portions: 0,
        type: 'ingredient',
        edited: false
    }
    export default defineComponent({
        components: {
            dataTable
        },
        setup() {
            const store = useIngredientStore()
            const shared = useSharedStore()
            const setActiveCategory = (id) => store.setActiveCategory(id)

            const { loading } = storeToRefs(shared)

            let ingredients = computed(() => store.ingredients)
            let categoryRows = ref([{ ...modelCategory }]);

            const category = computed(() => store.activeCategory);

            const fetchCategories = async () => {
                shared.setLoading(true)
                let result = await store.fetchCategories()
                categoryRows.value = result.map((category) => {
                    return {
                        id: category.id,
                        name: category.name || '',
                        type: 'category',
                        created: true
                    }
                })
                if (result.length && !store.activeCategory) setActiveCategory(result[0].id)
                shared.setLoading(false)
            }

            fetchCategories()

            return {
                ingredients,
                categoryRows,
                modelCategory,
                modelIngredient,
                category,
                setActiveCategory,
                loading,
                shared,
                store
            }
        }
    })
</script>

<style scoped>

</style>
