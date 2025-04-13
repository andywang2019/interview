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
  getFormInstance = () => {
    return this.formRef.current;
  };
  static propTypes = {
    categoryName: PropTypes.string.isRequired,

  }


  render() {
   // const {categorys, parentId} = this.props
    const {categoryName} = this.props


    return (
      <Form ref={ this.formRef }>
        <Form.Item name="categoryName"    initialValue={categoryName}     rules={[
          { required: true, message: 'Please enter  categoryName!' },
        ]}>

              <Input placeholder='请输入分类名称'/>

        </Form.Item>
      </Form>
    )
  }
}

export default UpdateForm