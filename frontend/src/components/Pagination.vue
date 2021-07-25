<template>
  <div>
    <nav
      class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
      aria-label="pagination"
      v-if="pagesCount > 0"
    >
      <button
        :disabled="modelValue === 1"
        :class="{
          'text-gray-500 border-gray-300 hover:bg-gray-50': modelValue > 1,
          'bg-white border-gray-200 cursor-not-allowed text-gray-200': modelValue === 1,
        }"
        class="relative inline-flex items-center px-2 py-2 rounded-l-md border bg-white text-sm font-medium"
        @click="onClickChangePage(modelValue - 1)">
        <span class="sr-only">Previous</span>
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </button>

      <button
        class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
        :key="pageItemIndex"
        :class="pageItemClasses(pageItem)"
        :disabled="modelValue === pageItem"
        v-for="(pageItem, pageItemIndex) in pageItems"
        @click="onClickChangePage(pageItem)"
      >
        {{ [modelValue - 2, modelValue + 2].includes(pageItem) && ![1, pagesCount].includes(pageItem) ? '...' : pageItem }}
      </button>

      <button
        :disabled="modelValue === pagesCount"
        :class="{
          'text-gray-500 border-gray-300 hover:bg-gray-50': modelValue < pagesCount,
          'bg-white border-gray-200 cursor-not-allowed text-gray-200': modelValue === pagesCount,
        }"
        class="relative inline-flex items-center px-2 py-2 rounded-r-md border bg-white text-sm font-medium"
        @click="onClickChangePage(modelValue + 1)">
        <span class="sr-only">Next</span>
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  props: {
    modelValue: {
      type: Number as PropType<number>,
      default: 1
    },
    total: {
      type: Number as PropType<number>,
      required: true,
      validator: (value: any) => value >= 0
    },
    perPage: {
      default: 25,
      type: Number as PropType<number>,
      validator: (value: any) => value >= 1
    },
  },
  emits: ['update:modelValue'],
  computed: {
    pagesCount(): number {
      return Math.ceil(+this.total / +this.perPage)
    },
    pageItems(): Array<number> {
      return [
        1,
        +this.modelValue - 2,
        +this.modelValue - 1,
        +this.modelValue,
        +this.modelValue + 1,
        +this.modelValue + 2,
        +this.pagesCount,
      ].filter((value: any, index: number, self: Array<number>): boolean => self.indexOf(value) === index && value > 0 && value <= this.pagesCount)
    }
  },
  methods: {
    pageItemClasses(pageItem: number): any {
      const value = Number(this.modelValue)

      return {
        'cursor-default': value === pageItem,
        'border-gray-300 bg-white text-gray-700': false,
        'z-10 bg-indigo-50 border-indigo-500 text-indigo-600': value === pageItem,
        'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': value !== pageItem,
      }
    },
    onClickChangePage(page: number) {
      this.$emit('update:modelValue', page)
    }
  }
})
</script>
