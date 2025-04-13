import React, {Component, createRef, forwardRef, useImperativeHandle} from 'react'
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
const WrapperFunctionAddForm = forwardRef(({ categorys, parentId }, ref) => {
    const [form] = Form.useForm();

    // 将内部方法暴露给外部使用
    useImperativeHandle(ref, () => ({
        validateFields: () => form.validateFields(),
        getFieldsValue: () => form.getFieldsValue(),
        resetFields: () => form.resetFields(),
    }));

    return (
        <Form form={form}>
            <Form.Item name='parentId' initialValue={parentId}>
                <Select options={[{ value: '0', label: <span>一级分类</span> }, ...categorys.map(c => ({ value: c._id, label: c.name }))]} />
            </Form.Item>

            <Form.Item name="categoryName" rules={[{ required: true, message: '请输入分类名称' }]}>
                <Input placeholder='请输入分类名称' />
            </Form.Item>
        </Form>
    );
});

WrapperFunctionAddForm.propTypes = {
    categorys: PropTypes.array.isRequired,
    parentId: PropTypes.string.isRequired,
};

export default WrapperFunctionAddForm;