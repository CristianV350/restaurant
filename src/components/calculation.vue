<template>
  <div id="categories">
    <h2>Groups</h2>
    <div id="groups-list">
      <dataTable
        itemType="group"
        :data="groupRows"
        :loading="loading"
        :key="groupRows.length"
        :item-id="group"
        :model="modelGroups"
        :actions="['edit', 'save', 'delete']"
        @addAction="store.addGroup"
        @updateAction="store.updateGroup"
        @fetchItems="fetchGroups"
        @category="store.setActiveGroup"
      >
      </dataTable>
    </div>
  </div>
  <div id="ingredients">
    <h2>Food and Ingredients</h2>
    <div id="food-list" v-if="groupRows.length">
      <dataTable
        itemType="food"
        :loading="loading"
        :key="foodRows.length"
        :updateAction="store.updateFood"
        :item-id="group"
        :model="modelFoods"
        :data="foodRows"
        :actions="['edit', 'save', 'delete']"
        @addAction="store.addFood"
        @category="store.setActiveFood"
        @modal="toggleModal"
        @fetchItems="fetchFoods"
      >
      </dataTable>

      <modal
        @fetchItems="fetchFoodIngredients"
        :key="food"
        @modal="toggleModal"
        :itemId="food"
        :type="'group'"
        :data="modalFoods"
        :group="group"
        :dialog="modal"
      ></modal>

      <div id="food-ingredient-list">
        <dataTable
          v-if="foodRows.length"
          itemType="food_ingredient"
          :loading="loading"
          :key="foodIngredientRows.length"
          :item-id="food"
          :model="modelFoodIngredients"
          :data="foodIngredientRows"
          :no-row="false"
          :actions="['add', 'edit', 'save', 'delete']"
          @addAction="store.addFoodIngredient"
          @updateAction="store.updateFoodIngredient"
          @deleteAction="store.deleteFoodIngredient"
          @fetchItems="fetchFoodIngredients"
        >
        </dataTable>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted } from "vue";
import { useCalculationStore } from "../store/calculation";
import { useIngredientStore } from "../store/ingredients";
import dataTable from "../components/dataTable.vue";
import modal from "../components/modal.vue";

const modelGroups = {
  name: "",
  type: "group",
  edited: false,
};

const modelFoods = {
  name: "",
  portions: 0,
  price_portion: 0,
  type: "food",
  edited: false,
};

const modelFoodIngredients = {
  name: "",
  portions: 0,
  price_portion: 0,
  type: "food_ingredient",
  edited: false,
};

export default defineComponent({
  components: {
    dataTable,
    modal,
  },
  setup() {
    const store = useCalculationStore();
    const iStore = useIngredientStore();
    const modal = ref(false);
    const loading = ref(false);

    //Groups
    let groupRows = ref([]);
    const group = computed(() => store.activeGroup);

    let foodRows = ref([]);
    const food = computed(() => store.activeFood);
    const foodName = ref(null);

    //Foods
    const categories = computed(() => iStore.categories);
    const ingredients = computed(() => iStore.ingredients);

    //Ingredients
    let foodIngredientRows = ref([]);

    const fetchGroups = async () => {
      loading.value = true;
      let result = await store.fetchGroups();
      if (result.length) groupRows.value = result;
      loading.value = false;
    };

    const fetchFoods = async () => {
      loading.value = true;
      let result = await store.fetchFoods();
      if (result.length) foodRows.value = result;
      if (foodRows.value.length) foodName.value = foodRows.value[0].name;
      loading.value = false;
    };

    const fetchFoodIngredients = async () => {
      loading.value = true;
      let result = await store.fetchFoodIngredients();
      if (result.length) foodIngredientRows.value = result;
      loading.value = false;
    };

    (async () => {
      await fetchGroups();
      await iStore.fetchCategories();
      await fetchFoods();
      await fetchFoodIngredients();
    })();

    const modalFoods = computed(() => {
      let result = foodRows.value || [];
      return result.map((item) => {
        return {
          children: ingredients.value.map((elem) => {
            return {
              key: elem.id,
              name: elem.name,
              category_id: elem.category_id,
            };
          }),
          disabled: false,
          key: item.id,
          name: item.name,
        };
      });
    });

    const setLoading = (v) => {
      loading.value = v;
    };

    const toggleModal = (v) => {
      modal.value = v;
    };
    return {
      foodRows,
      groupRows,
      modelFoods,
      modelGroups,
      ingredients,
      store,
      iStore,
      group,
      food,
      foodName,
      modelFoodIngredients,
      foodIngredientRows,
      categories,
      loading,
      setLoading,
      modal,
      modalFoods,
      toggleModal,
      fetchFoodIngredients,
      fetchFoods,
      fetchGroups,
    };
  },
});
</script>

<style scoped></style>
