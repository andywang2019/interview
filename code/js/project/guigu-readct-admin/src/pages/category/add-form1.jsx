import React, {Component, createRef} from 'react'
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
class AddForm1 extends Component {
  form = React.createRef(); // <-- Form ref


  static propTypes = {

    categorys: PropTypes.array.isRequired, // 一级分类的数组
    parentId: PropTypes.string.isRequired, // 父分类的ID
  }

  componentDidMount() {
      this.props.setForm(this.form)

  }

  render() {
    const {categorys, parentId} = this.props


    return (
      <Form ref={this.form}>
        <Form.Item name='parentId'>
            <Select options={[{ value: '0', label: <span>一级分类</span> }]} />



        </Form.Item>

        <Form.Item name="categoryName">

              <Input placeholder='请输入分类名称'/>


        </Form.Item>
      </Form>
    )
  }
}

export default AddForm1;