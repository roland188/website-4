import Vue from 'vue';
import {
    Message,
    MessageBox,
    Loading,
    Dialog,
    Scrollbar,
    Form,
    FormItem,
    Input,
    RadioGroup,
    Checkbox,
    Radio,
    DatePicker,
    Button,
    Pagination,
    Popover,
    Collapse,
    CollapseItem,
    Col,
    Image,
    Table,
    TableColumn,
    Backtop,
    Row,
    Select,
    Option,
    Tabs,
    TabPane,
    Link,
  } from 'element-ui';
  
  Vue.use(Link);
  Vue.use(TabPane);
  Vue.use(Tabs);
  Vue.use(Option);
  Vue.use(Select);
  Vue.use(Row);
  Vue.use(Backtop);
  Vue.use(TableColumn);
  Vue.use(Table);
  Vue.use(Image);
  Vue.use(Col);
  Vue.use(CollapseItem);
  Vue.use(Collapse);
  Vue.use(Popover);
  Vue.use(Pagination);
  Vue.use(Button);
  Vue.use(DatePicker);
  Vue.use(Radio);
  Vue.use(RadioGroup);
  Vue.use(Input);
  Vue.use(FormItem);
  Vue.use(Form);
  Vue.use(Scrollbar);
  Vue.use(Dialog);
  Vue.use(Checkbox);
  Vue.use(Loading);
Vue.prototype.$message = Message;
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;

import './assets/css/element-variables.scss'