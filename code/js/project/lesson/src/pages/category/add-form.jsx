import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input
} from 'antd'
import withRouter from "../../utils/withRouter";

const Item = Form.Item
const Option = Select.Option

/*
添加分类的form组件
 */
class AddForm extends Component {
  formRef = React.createRef(); // <-- Form ref

    getFormInstance = () => {
        return this.formRef.current;
    };
  static propTypes = {
      formRef: PropTypes.object.isRequired, // 用来传递form对象的函数
    categorys: PropTypes.array.isRequired, // 一级分类的数组
    parentId: PropTypes.string.isRequired, // 父分类的ID
  }

    componentDidMount () {
   // this.props.setForm(this.formRef)
  }

  render() {
    const {categorys, parentId} = this.props
    //const { getFieldDecorator } = this.props.form

    return (
      <Form ref={this.formRef}  >
        <Form.Item name='parentId' initialValue={  parentId }  >
            <Select defaultValue={  parentId } >
                <Option value='0' key={'0'}><span>一级分类</span></Option>
            {
                categorys.map(c => <Option key={c._id} value={c._id} >{c.name}</Option>)
            }
            </Select>
        </Form.Item>

        <Form.Item name="categoryName">

              <Input placeholder='请输入分类名称'/>


        </Form.Item>
      </Form>
    )
  }
}

export default withRouter(AddForm);