<script setup>
import {
    mdiMonitorCellphone,
    mdiTableBorder,
    mdiTableOff,
    mdiGithub,
    mdiMapMarker
} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import Table from '@/components/Table.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'
import { mdiBallotOutline, mdiAccount, mdiMail } from "@mdi/js";
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
import FormFilePicker from "@/components/FormFilePicker.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import SectionTitle from "@/components/SectionTitle.vue";
import NotificationBarInCard from "@/components/NotificationBarInCard.vue";
import { useCheckpointStore } from '@/stores/checkpoint'
import { computed, ref, reactive } from '@vue/runtime-core'

import checkHeaders from '@/documents/checkpoints.json'
import { EventBus } from '@/services/event'

const checkpointStore = useCheckpointStore()
const checkpoints = computed(() => checkpointStore.checkpoints)
checkpointStore.fetch()

const form = reactive({
    name: 'John Doe',
    address: '',
})
EventBus.on(`command-save`, () => {
    console.log('save')
})
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Checkpoints" main />

      <CardBox class="mb-6" has-table>
        <Table
          checkable
          :headers="checkHeaders"
          :items="checkpoints"
          :actions="['create', 'cancel']"
        >
          <template #modal>
            <CardBox form @submit.prevent="submit">
              <FormField label="Nume si adresa">
                <FormControl v-model="form.name" :icon="mdiAccount" />
                <FormControl v-model="form.address" type="text" :icon="mdiMapMarker" />
              </FormField>
            </CardBox>
          </template>
        </Table>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
