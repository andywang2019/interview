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
class ChildClasAddForm extends Component {

    getFormInstance = () => {
        return this.formRef.current;
    };

  static propTypes = {

    categorys: PropTypes.array.isRequired, // 一级分类的数组
    parentId: PropTypes.string.isRequired, // 父分类的ID
  }

  render() {
    const {categorys, parentId} = this.props

    return (
      <Form {...this.props} >
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

// 2. Create a wrapper component that handles the form instance
const WrapperClassChildAddForm = React.forwardRef((props, ref) => {
    const [form] = Form.useForm();

    // Expose form methods to parent via ref
    React.useImperativeHandle(ref, () => ({
        validateFields: form.validateFields,
        getFieldsValue: form.getFieldsValue,
        setFieldsValue: form.setFieldsValue,
        resetFields: form.resetFields
    }));

    // Pass the form instance to the child component
    return <ChildClasAddForm {...props} form={form} />;
});
export default WrapperClassChildAddForm;