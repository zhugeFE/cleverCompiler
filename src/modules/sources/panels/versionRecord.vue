<template>
  <div class="sources-version-record content">
    <div class="version-panel">
      <div class="item">
        <div class="header">10.0</div>
        <div class="main">
          <div class="node-line"></div>
          <div class="node-icon"></div>
        </div>
        <div class="footer">2019.02.18</div>
      </div>
      <div class="item">
        <div class="header">10.0</div>
        <div class="main">
          <div class="node-line"></div>
          <div class="node-icon"></div>
        </div>
        <div class="footer">2019.02.18</div>
      </div>
      <div class="item active">
        <div class="header">10.0</div>
        <div class="main">
          <div class="node-line"></div>
          <div class="node-icon"></div>
        </div>
        <div class="footer">2019.02.18</div>
      </div>
      <div class="item today">
        <div class="header">
          <i class="icon-add-thin"></i>
        </div>
        <div class="main">
          <div class="node-line"></div>
          <div class="node-icon"></div>
        </div>
        <div class="footer">今天</div>
      </div>
    </div>
    <div class="content-panel"></div>
  </div>
</template>

<script>
  export default {
    name: 'sourcesVersionRecord'
  }
</script>

<style lang="sass">
.sources-version-record
  .version-panel
    border: 1px solid #DCDFE6
    padding: 20px
    display: flex
    width: 80%
    overflow-x: auto
    .item
      display: inline-block
      font-size: 14px
      width: 100px
      flex: none
      .main
        width: 100%
        height: 12px
        position: relative
        .node-line
          height: 2px
          width: 100%
          border-color: inherit
          background-color: #c0c4cc
          position: absolute
          top: 4px
        .node-icon
          width: 12px
          height: 12px
          position: absolute
          background-color: #e4e7ed
          border-radius: 50%
          cursor: pointer
          &:hover
            background-color: #00a0ea
    .item.active
      color: #00a0ea
      .node-icon
        background-color: #00a0ea
    .item.today
      flex: 1
      font-weight: 200
  .content-panel
    width: 80%
    height: 500px
    border: 1px solid #DCDFE6

</style>
