<template>
  <div class="flex w-full items-center justify-center p-4">
    <div class="container bg-white p-5 border rounded">
      <app-dataTable
        title="Transactions"
        v-bind="transactionsBindOptions"
      >

        <!-- eslint-disable-next-line -->
        <template v-slot:item.transactionDate="{ item }">
          <span class="whitespace-nowrap">
            {{ dateTimeFormatter(item.transactionDate) }}
          </span>
        </template>

        <!-- eslint-disable-next-line -->
        <template v-slot:item.status="{ item }">
          <span class="text-sm font-medium bg-blue-400 py-1 px-2 rounded text-white align-middle">
            {{ item.status }}
          </span>
        </template>

        <!-- eslint-disable-next-line -->
        <template v-slot:item.amount="{ item }">
          <span
            class="text-sm font-medium"
            :class="{ 'text-green-500': item.amount > 0, 'text-red-500': item.amount < 0 }"
          >
            {{ item.amount }}
          </span>
        </template>

        <!-- eslint-disable-next-line -->
        <template v-slot:item.actions="{ item }">
          <div class="flex items-center justify-center">
            <router-link
              :to="{ name: 'transactions-view', params: { id: item.id } }"
              class="w-6 transform text-gray-500 hover:text-purple-500 cursor-pointer hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </router-link>
          </div>
        </template>

      </app-dataTable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppDataTable from '@/components/DataTable.vue'

export default defineComponent({
  computed: {
    transactionsBindOptions() {
      return {
        url: '/transactions',
        columns: [
          { title: 'Account', field: 'account' },
          { title: 'Description', field: 'description' },
          { title: 'Category', field: 'category' },
          { title: 'Reference', field: 'reference' },
          { title: 'Currency', field: 'currency' },
          { title: 'Amount', field: 'amount' },
          { title: 'Status', field: 'status' },
          { title: 'Transaction Date', field: 'transactionDate' },
          { title: 'Actions', field: 'actions' },
        ],
      }
    }
  },
  components: {
    AppDataTable,
  }
});
</script>
