import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { useMainStore } from "@/stores/main.js";
import { useStyleStore } from "@/stores/style.js";
import { darkModeKey, styleKey } from "@/config.js";

import "./css/main.css";
import { useIngredientStore } from '@/stores/ingredients.js';
import { useCalculationStore } from '@/stores/calculation.js';
import { useMenuStore } from '@/stores/menu.js';

/* Init Pinia */
const pinia = createPinia();

/* Create Vue app */
createApp(App).use(router).use(pinia).mount("#app");

/* Init Pinia stores */
const mainStore = useMainStore(pinia);
const ingredientStore = useIngredientStore(pinia);
const calculationStore = useCalculationStore(pinia);
const menuStore = useMenuStore(pinia);
const styleStore = useStyleStore(pinia);

/* Fetch sample data */
ingredientStore.fetchCategories()
ingredientStore.fetchIngredients()
calculationStore.fetchGroups()
calculationStore.fetchFoods()
calculationStore.fetchFoodIngredients()
menuStore.fetchMenus()
menuStore.fetchMenuItems()

/* App style */
styleStore.setStyle(localStorage[styleKey] ?? "basic");

/* Dark mode */
if (
  (!localStorage[darkModeKey] &&
    window.matchMedia("(prefers-color-scheme: dark)").matches) ||
  localStorage[darkModeKey] === "1"
) {
  styleStore.setDarkMode(true);
}

/* Default title tag */
const defaultDocumentTitle = "Admin One Vue 3 Tailwind";

/* Set document title from route meta */
router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle;
});
