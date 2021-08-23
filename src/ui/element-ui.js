import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'

import {
  Icon,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Button,
  Tag,
  ColorPicker,
  Input,
  Checkbox,
  Table,
  TableColumn,
  Message,
  Dialog,
  Form,
  FormItem,
  Tree,
  Select,
  Option,
  InputNumber,
  Radio,
  RadioGroup,
  Switch,
  MessageBox,
  Loading,
  Pagination,
  Tooltip,
  CheckboxGroup,
  Image,
  Row,
  Col,DatePicker
} from 'element-ui'

Vue
  .use(Icon)
  .use(Dropdown)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Button)
  .use(Tag)
  .use(ColorPicker)
  .use(Input)
  .use(Checkbox)
  .use(Table)
  .use(TableColumn)
  .use(Dialog)
  .use(Form)
  .use(FormItem)
  .use(Tree)
  .use(Select)
  .use(Option)
  .use(InputNumber)
  .use(Radio)
  .use(RadioGroup)
  .use(Switch)
  .use(Loading)
  .use(Pagination)
  .use(Tooltip)
  .use(CheckboxGroup)
  .use(Image)
  .use(Row)
  .use(Col)
.use(DatePicker)

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
