<template>
  <div :class="['tabs-panel', position]">
    <div class="tabs-header">
      <div v-for="tab in tabs" :key="tab.value" @click="onChosen(tab)" :class="getItemClass(tab)">{{tab.label}}</div>
    </div>
    <div class="tabs-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'tabsPanelIndex',
    props: {
      value: {
        type: String,
        default() {
          return ''
        }
      },
      position: {
        type: String,
        default() {
          return 'top'
        },
        validator (value) {
          return ['left', 'top'].includes(value)
        }
      },
      tabs: {
        type: Array,
        default() {
          // 结构为：{value: '', label: ''}
          return []
        }
      }
    },
    data() {
      return {
      }
    },
    watch: {
      tabs: {
        handler: function() {
          console.log(this.tabs)
        },
        deep: true
      }
    },
    methods: {
      getItemClass(data) {
        return {
          'tabs-item': true,
          'active': data.value === this.value
        }
      },
      onChosen(data) {
        this.$emit('input', data.value)
      }
    }
  }
</script>

<style lang="sass">
@import "./styles/index"
</style>
