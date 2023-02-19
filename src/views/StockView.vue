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
import { computed } from 'vue'
import { useCategoryStore } from '@/stores/category'
import { useCheckpointStore } from '@/stores/checkpoint'
import { useIngredientStore } from '@/stores/ingredients'

import catHeaders from '@/documents/categories.stock.json'
import ingHeaders from '@/documents/ingredients.stock.json'
import checkHeaders from '@/documents/checkpoints.json'

const checkpointStore = useCheckpointStore()
const checkpoints = computed(() => checkpointStore.checkpoints)
const checkpoint = computed(() => checkpointStore.activeCheckpoint)
checkpointStore.fetch()

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
      <SectionTitleLineWithButton
        :icon="mdiTableBorder"
        title="Checkpoints"
        main
      />

      <CardBox
        class="mb-6"
        has-table
      >
        <div>
          <Table
            :headers="checkHeaders"
            :items="checkpoints"
            :active-item="checkpoint"
            @check="checkpointStore.setActiveCheckpoint"
            @uncheck="checkpointStore.setActiveCheckpoint"
          />
        </div>
      </CardBox>

      <SectionTitleLineWithButton
        v-if="category"
        :icon="mdiTableBorder"
        title="Ingredients"
        main
      />

      <CardBox
        v-if="category"
        class="mb-6"
        has-table
      >
        <div>
          <Table
            checkable
            :headers="ingHeaders"
            :items="ingredients"
          />
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
