import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input
} from 'antd'

const Item = Form.Item

/*
更新分类的form组件
 */
class UpdateForm extends Component {
  formRef = React.createRef(); // Will hold the Ant Design form instance
  static propTypes = {
    categoryName: PropTypes.string.isRequired,
    setForm: PropTypes.func.isRequired
  }

  componentDidMount () {
    // 将form对象通过setForm()传递父组件
    this.props.setForm(this.formRef)
  }

  render() {

    const {categoryName} = this.props
   // const { getFieldDecorator } = this.props.form

    return (
      <Form ref={this.formRef}>
        <Form.Item name="categoryName" initialValue={categoryName}>

              <Input placeholder='请输入分类名称'/>

        </Form.Item>
      </Form>
    )
  }
}

export default UpdateForm;