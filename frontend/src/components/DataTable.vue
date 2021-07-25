<template>
  <div>
    <div class="mb-4">
      <h2 class="text-2xl font-bold leading-7 text-gray-800 sm:text-3xl sm:truncate" v-if="title">
        {{ title }}
      </h2>
      <span class="text-sm text-gray-600">
        {{ countStatisticsText }}
      </span>
    </div>

    <div class="grid sm:grid-cols-1 md:grid-cols-2 flex items-end">
      <div class="flex items-start flex-col mb-4">
        <label class="text-gray-800">Date between</label>
        <date-picker
          is-range
          :model-config="{ type: 'string', mask: 'YYYY-MM-DD' }"
          v-model="dateBetween"
          @update:modelValue="onChangeDateBetween"
        >
          <template v-slot="{ inputValue, inputEvents }">
            <div class="flex justify-center items-center">
              <input
                readonly
                :value="inputValue.start"
                v-on="inputEvents.start"
                placeholder="From date"
                class="border px-2 py-1 w-32 rounded text-gray-600 focus:outline-none focus:border-indigo-300"
              />
              <svg
                class="w-4 h-4 mx-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
              <input
                readonly
                :value="inputValue.end"
                v-on="inputEvents.end"
                placeholder="To date"
                class="border px-2 py-1 w-32 rounded text-gray-600 focus:outline-none focus:border-indigo-300"
              />
            </div>
          </template>
        </date-picker>
      </div>

      <div class="flex justify-end mb-4">
        <app-pagination
          :total="totalItems"
          :per-page="itemsPerPage"
          v-model="currentPage"
          @update:modelValue="onChangeCurrentPage"
        />
      </div>
    </div>

    <div class="overflow-auto">
      <table class="table-auto table w-full">
        <thead>
          <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th
              :key="columnIndex"
              v-for="(column, columnIndex) in columns"
              class="py-3 px-6 text-left"
            >
              {{ column[titleKey] }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            :key="itemIndex"
            v-for="(item, itemIndex) in items"
            :class="{ 'bg-gray-50': itemIndex % 2 === 0 }"
            class="border-b border-gray-200 hover:bg-gray-100"
            @click="onItemRowEvent('click', item, itemIndex)"
          >
            <td
              :key="columnIndex"
              v-for="(column, columnIndex) in columns"
              class="py-3 px-6 text-left"
            >
            <slot :name="`item.${column[fieldKey]}`" :item="item">
              {{ item[column[fieldKey]] }}
            </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script lang="ts">
import { DatePicker } from 'v-calendar'
import axios, { AxiosRequestConfig } from 'axios'
import AppPagination from '@/components/Pagination.vue'
import {
  ref,
  Ref,
  watch,
  toRefs,
  ToRefs,
  PropType,
  onMounted,
  defineComponent,
} from 'vue'

interface IColumnPropType {
  title: string;
  field: string;
}

interface IDateBetween {
  start?: string;
  end?: string;
}

interface IQuery {
  page?: number;
  date_from?: string;
  date_to?: string;
}

enum IItemRowEvents {
  CLICK = 'click'
}

export default defineComponent({
  setup: (props) => {
    const items = ref([]);
    const totalItems: Ref<number> = ref<number>(0);
    const currentPage: Ref<number> = ref<number>(1);
    const dateBetween: Ref<IDateBetween> = ref<IDateBetween>({} as IDateBetween);
    const query: Ref<IQuery> = ref<IQuery>({} as IQuery);

    const { url, params, itemsKey, totalItemsKey }: ToRefs = toRefs(props);

    const fetchItems = async () => {
      const { data } = await axios.get(url.value, {
        params: {
          ...query.value,
          ...params.value,
        },
      })

      items.value = itemsKey.value ? (data[itemsKey.value] || []) : data
      totalItems.value = data[totalItemsKey.value] || 0
    }

    const onChangeCurrentPage = (page: number) => {
      query.value = {
        ...query.value,
        page
      }
    }

    const onChangeDateBetween = (dateBetween: IDateBetween) => {
      currentPage.value = 1
      query.value = {
        ...query.value,
        // when date between filter is changed, the page should be reset to 1
        page: 1,
        date_from: dateBetween.start,
        date_to: dateBetween.end,
      }
    }

    onMounted(fetchItems);
    watch(query, fetchItems)

    return {
      items,
      query,
      totalItems,
      fetchItems,
      currentPage,
      dateBetween,
      onChangeDateBetween,
      onChangeCurrentPage,
    }
  },
  emits: ['item-click'],
  props: {
    url: {
      type: String as PropType<string>,
      default: "title",
      required: true,
    },
    title: {
      type: String as PropType<string>,
    },
    itemsKey: {
      type: String as PropType<string>,
      default: "items",
    },
    totalItemsKey: {
      type: String as PropType<string>,
      default: "total",
    },
    itemsPerPage: {
      default: 25,
      type: Number as PropType<number>,
      validator: (value: any) => value >= 1
    },
    columns: {
      type: Array as PropType<Array<IColumnPropType>>,
      default: (): Array<IColumnPropType> => [],
      required: true,
    },
    titleKey: {
      type: String as PropType<string>,
      default: "title",
    },
    fieldKey: {
      type: String as PropType<string>,
      default: "field",
    },
    params: {
      type: Object as PropType<AxiosRequestConfig>,
      default: () => ({}),
    },
    itemRowEvents: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    onItemRowEvent(event: IItemRowEvents, item: any, itemIndex: number) {
      // @ts-ignore
      this.$emit(`item-${event}`, item, itemIndex)
    }
  },
  computed: {
    countStatisticsText(): string {
      const showItemsCount = this.itemsPerPage > this.totalItems ? this.totalItems : this.itemsPerPage
      return `Show ${showItemsCount} out of ${this.totalItems}`
    },
  },
  components: {
    DatePicker,
    AppPagination,
  }
})
</script>
