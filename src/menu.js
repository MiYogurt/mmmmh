import { Menu } from 'electron'
import { showConfigWindow } from './config'

export default Menu.buildFromTemplate([
  {
    label: 'Setting',
    click() {
      console.log('clock Setting')
      showConfigWindow()
    }
  },
  {
    label: 'Exit',
    role: 'quit'
  }
])
