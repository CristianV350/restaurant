<script setup>
import {
    mdiMonitorCellphone,
    mdiTableBorder,
    mdiTableOff,
    mdiGithub
} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import Table from '@/components/Table.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'
import { computed } from '@vue/runtime-core'
import { useCategoryStore } from '@/stores/category'
import { useIngredientStore } from '@/stores/ingredients'

const categoryStore = useCategoryStore()
const categories = computed(() => categoryStore.categories)
const category = computed(() => categoryStore.activeCategory)
categoryStore.fetch()

const ingredientStore = useIngredientStore()
const ingredients = computed(() => ingredientStore.ingredients)
ingredientStore.getByCategory()
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Checkpoints" main />
      <NotificationBar color="info" :icon="mdiMonitorCellphone">
        <b>Responsive table.</b> Collapses on mobile
      </NotificationBar>

      <CardBox class="mb-6" has-table>
        <Table
          :items="categories"
          :activeItem="category"
          @check="categoryStore.setActiveCategory"
          @uncheck="categoryStore.setActiveCategory"
        />
      </CardBox>

      <CardBox class="mb-6" has-table>
        <Table
          v-if="category"
          checkable
          :items="ingredients"
        />
      </CardBox>

      <SectionTitleLineWithButton :icon="mdiTableOff" title="Empty variation" />

      <NotificationBar color="danger" :icon="mdiTableOff">
        <b>Empty table.</b> When there's nothing to show
      </NotificationBar>

      <CardBox>
        <CardBoxComponentEmpty />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
