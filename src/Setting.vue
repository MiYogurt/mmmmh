<template>
  <div>
      <h2>Setting</h2>
      <div class="container">
        <div class="outputDir">
          <h4>Current Output Directory</h4>
          <code>{{ savePath }}</code>
          <button class="btn" @click="selectFolder">Change Output Directory</button>
        </div>
        <div class="outputType">
          <h4>Current Output Type</h4>
          <div class="btn-group">
            <button :class="{'active': outputType == 'webp'}" @click="set('webp')">WEBP</button>
            <button :class="{'active': outputType == 'png'}" @click="set('png')">PNG</button>
            <button :class="{'active': outputType == 'jpeg'}" @click="set('jpeg')">JPEG</button>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'setting',
  data () {
    return ipcRenderer.sendSync('config:read')
  },
  mounted(){
    ipcRenderer.on('config:update', (event, {name, value}) => {
      this[name] = value
    })
  },
  methods: {
    selectFolder() {
      ipcRenderer.send('config:open-file')
    },
    set(value) {
      ipcRenderer.send('config:type', { name: 'outputType', value })
    }
  }
}
</script>

<style lang="stylus">
*
  font-family: 'sans-serif', 'Fira Code'
h2
  text-align: center
  padding-top: 20px
  padding-bottom: 20px
  background: #56CB9C
  color: #fff
  font-size: 32px
  user-select: none
.outputType
  padding: 10px 5px
  background: #fff
  .btn-group
    display: flex
    margin-top: 10px
.outputDir
  padding: 10px 5px
  background: #f7f7f7
  color: #3b6d59
  code
    display: block
    font-size: 12px
    margin: 5px auto
    padding: 5px
    max-width: 100%
    word-wrap: break-word
    line-height: 1.2
.btn
button
  border: none
  padding: 5px 10px
  box-shadow: none
  cursor: pointer
  outline: none
  background: #56cb9c
  color: #fff
  &:hover
  &.active
    background: #4cb58b

</style>
