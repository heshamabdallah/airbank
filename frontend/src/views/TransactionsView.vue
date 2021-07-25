<template>
  <div class="flex w-full items-center justify-center p-4">
    <div class="container bg-white px-6 py-4 border rounded">
      <table class="table w-full text-left" v-if="!loadingTransaction">
        <tbody>
          <tr>
            <th class="text-lg py-2">Account</th>
            <td class="text-gray-600 py-2">{{ transaction.account }}</td>
          </tr>
          <tr>
            <th class="text-lg py-2">Description</th>
            <td class="text-gray-600 py-2">{{ transaction.description }}</td>
          </tr>
          <tr>
            <th class="text-lg py-2">Category</th>
            <td class="text-gray-600 py-2">{{ transaction.category }}</td>
          </tr>
          <tr>
            <th class="text-lg py-2">Reference</th>
            <td class="text-gray-600 py-2">{{ transaction.reference }}</td>
          </tr>
          <tr>
            <th class="text-lg py-2">Currency</th>
            <td class="text-gray-600 py-2">{{ transaction.currency }}</td>
          </tr>
          <tr>
            <th class="text-lg py-2">Amount</th>
            <td class="text-gray-600 py-2">
              <span
                class="text-sm font-medium"
                :class="{ 'text-green-500': transaction.amount > 0, 'text-red-500': transaction.amount < 0 }"
              >
                {{ transaction.amount }}
              </span>
            </td>
          </tr>
          <tr>
            <th class="text-lg py-2">Status</th>
            <td class="text-gray-600 py-2">
              <span class="text-sm font-medium bg-blue-400 py-1 px-2 rounded text-white align-middle">
                {{ transaction.status }}
              </span>
            </td>
          </tr>
          <tr>
            <th class="text-lg py-2">Transaction Date</th>
            <td class="text-gray-600 py-2">{{ dateTimeFormatter(transaction.transactionDate) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import {
  ref,
  Ref,
  onMounted,
  defineComponent,
} from 'vue'

interface ITransaction {
  id: string
  account: string
  description: string
  category: string
  reference?: string
  currency: string
  amount: string
  status: string
  transactionDate: string
  createdAt: string
  updatedAt: string
}

export default defineComponent({
  setup: () => {
    const router = useRouter()
    const { params } = useRoute()
    const transaction: Ref<ITransaction> = ref<ITransaction>({} as ITransaction);
    const loadingTransaction: Ref<boolean> = ref<boolean>(true);

    const fetchTransactionDetails = async() => {
      try {
        loadingTransaction.value = true
        const { data } = await axios.get(`/transactions/${params.id}`)
  
        loadingTransaction.value = false
        transaction.value = data.transaction
      } catch (e) {
        loadingTransaction.value = false
        router.push({
          name: 'transactions',
        })
      }
    }

    onMounted(fetchTransactionDetails)

    return {
      transaction,
      loadingTransaction,
      fetchTransactionDetails,
    }
  }
});
</script>
