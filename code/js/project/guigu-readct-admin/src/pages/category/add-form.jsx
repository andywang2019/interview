import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option

/*
添加分类的form组件
 */
class AddForm extends Component {
  formRef = React.createRef(); // <-- Form ref
  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    categorys: PropTypes.array.isRequired, // 一级分类的数组
    parentId: PropTypes.string.isRequired, // 父分类的ID
  }

  componentWillMount () {
    this.props.setForm(this.props.form)
  }

  render() {
    const {categorys, parentId} = this.props
    const { getFieldDecorator } = this.props.form

    return (
      <Form ref={this.formRef}>
        <Form.Item name='parentId'>
            <Select options={[{ value: 'sample', label: <span>sample</span> }]} />



        </Form.Item>

        <Form.Item name="categoryName">

              <Input placeholder='请输入分类名称'/>


        </Form.Item>
      </Form>
    )
  }
}

export default AddForm;