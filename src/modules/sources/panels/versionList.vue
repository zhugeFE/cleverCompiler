<template>
  <div class="sources-version-list content">
    <div class="version-panel">
      <div class="item" v-for="version in versionList" :key="version.name">
        <div class="header">{{version.name}}</div>
        <div class="main">
          <div class="node-line"></div>
          <div class="node-icon"></div>
        </div>
        <div class="footer">{{version.date}}</div>
      </div>
      <div class="item today">
        <div class="header">
          <i class="icon-add-thin"></i>
        </div>
        <div class="main">
          <div class="node-line">
            <div class="icon icon-start"></div>
          </div>
          <div class="node-icon"></div>
        </div>
        <div class="footer">今天</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'sourcesVersionList',
    props: {
      versionList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {

      }
    }
  }
</script>

<style lang="sass">
@import "../styles/versionRecord"
</style>
