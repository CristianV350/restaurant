<script setup>
import { computed, ref, toRefs } from 'vue'
import { mdiEye, mdiTrashCan, mdiPlus } from '@mdi/js'
import CardBoxModal from '@/components/CardBoxModal.vue'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import SectionMain from '@/components/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import { mdiBallotOutline, mdiAccount, mdiMail, mdiGithub } from "@mdi/js";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
import FormFilePicker from "@/components/FormFilePicker.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import SectionTitle from "@/components/SectionTitle.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import NotificationBarInCard from "@/components/NotificationBarInCard.vue";

import { useMainStore } from '@/stores/main'
import { EventBus } from '@/services/event'

const emit = defineEmits(['check', 'uncheck'])

const props = defineProps({
    checkable: Boolean,
    activeItem: {
      type: Number,
      default: null
    },
    actions: {
      type: Array,
      default: () => ["save", "cancel"]
    },
    headers: {
      type: Array,
      default: () => []
    },
    items: {
        type: Array,
        default: () => []
    }
})

const { checkable, activeItem, headers, items, actions } = toRefs(props)

const mainStore = useMainStore()
const mode = computed(() => mainStore.mode)
const setMode = (mode) => mainStore.setMode(mode)

const isModalActive = ref(false)

const isModalDangerActive = ref(false)

const perPage = ref(5)

const currentPage = ref(0)

const checkedRows = ref([])

const rows = ref({ ...items.value })

const itemsPaginated = computed(() => {
  if (!rows.value.length) return []
  return rows.value.slice(
      perPage.value * currentPage.value,
      perPage.value * (currentPage.value + 1)
  )
})

const numPages = computed(() => Math.ceil(items.value.length / perPage.value))

const currentPageHuman = computed(() => currentPage.value + 1)

const pagesList = computed(() => {
    const pagesList = []

    for (let i = 0; i < numPages.value; i++) {
        pagesList.push(i)
    }

    return pagesList
})

const remove = (arr, cb) => {
    const newArr = []

    arr.forEach((item) => {
        if (!cb(item)) {
            newArr.push(item)
        }
    })

    return newArr
}

const create = () => {

}

EventBus.on(`command-save`, () => {
  console.log('command-save')
})

const checked = (_, item) => {
  emit('check', item.id)
}
</script>

<template>
  <CardBoxModal
    v-model="isModalActive"
    :v-bind="$attrs"
    :actions="actions"
    title="Adauga"
  >
    <slot name="modal">

    </slot>
  </CardBoxModal>

  <CardBoxModal
    v-model="isModalDangerActive"
    title="Please confirm"
    button="danger"
    :actions="['delete']"
    has-cancel
  >
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is sample modal</p>
  </CardBoxModal>

  <div
    v-if="checkedRows.length"
    class="p-3 bg-gray-100/50 dark:bg-slate-800"
  >
    <span
      v-for="row in checkedRows"
      :key="row.id"
      class="inline-block px-2 py-1 rounded-sm mr-2 text-sm bg-gray-100 dark:bg-slate-700"
    >
      {{ row.name }}
    </span>
  </div>

  <table>
    <thead>
      <tr>
        <th v-if="checkable" />
        <th />
        <th
          v-for="header in headers"
          :key="header.id"
        >
          {{ header.name }}
        </th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in itemsPaginated"
        :key="item.id"
        :class="{'!bg-orange-500': activeItem == item.id}"
        @click="checked($event, item)"
      >
        <TableCheckboxCell
          v-if="checkable"
          @checked="checked($event, item)"
        />
        <td
          v-else
          class="lg:w-6"
        />
        <!-- <td class="border-b-0 lg:w-6 before:hidden">
          <UserAvatar
            :username="item.name"
            class="w-24 h-24 mx-auto lg:w-6 lg:h-6"
          />
        </td> -->
        <td :data-label="item.key">
          {{ item.name }}
        </td>
        <!-- <td data-label="Company">
          {{ client.company }}
        </td>
        <td data-label="City">
          {{ client.city }}
        </td>
        <td data-label="Progress" class="lg:w-32">
          <progress
            class="flex w-2/5 self-center lg:w-full"
            max="100"
            :value="client.progress"
          >
            {{ client.progress }}
          </progress>
        </td> -->
        <!-- <td data-label="Created" class="lg:w-1 whitespace-nowrap">
          <small
            class="text-gray-500 dark:text-slate-400"
            :title="client.created"
            >{{ client.created }}</small
          >
        </td> -->
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons
            type="justify-start lg:justify-end"
            no-wrap
          >
            <BaseButton
              color="info"
              :icon="mdiEye"
              small
              @click="isModalActive = true"
            />
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="isModalDangerActive = true"
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
  <CardBox
    v-if="!itemsPaginated.length"
  >
    <BaseButtons
      class="h-32"
      type="justify-center lg:justify-center"
      no-wrap
    >
      <BaseButton
        color="success"
        :icon="mdiPlus"
        small
        @click="isModalActive = true"
      />
    </BaseButtons>
  </CardBox>
  <div
    v-if="numPages > 1"
    class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800"
  >
    <BaseLevel>
      <BaseButtons>
        <BaseButton
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="currentPage = page"
        />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>
