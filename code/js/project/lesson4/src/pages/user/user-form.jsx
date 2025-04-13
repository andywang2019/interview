import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option

/*
添加/修改用户的form组件
 */
class UserForm extends PureComponent {
    formRef = React.createRef(); // <-- Form ref
  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    roles: PropTypes.array.isRequired,
    user: PropTypes.object
  }

  componentWillMount () {
    this.props.setForm(this.props.form)
  }

  render() {

    const {roles, user} = this.props
    const { getFieldDecorator } = this.props.form
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
      <Form ref={this.formRef} {...formItemLayout}>
        <Form.Item  name="username" label='用户名'>

              <Input placeholder='请输入用户名'/>

        </Form.Item>


            <Form.Item name="password" label='密码'>

                  <Input type='password' placeholder='请输入密码'/>

            </Form.Item>



          <Form.Item name="phone"   label='手机号'>

              <Input placeholder='请输入手机号'/>

        </Form.Item>
        <Form.Item name="email" label='邮箱'>

              <Input placeholder='请输入邮箱'/>

        </Form.Item>

       {/* <Form.Item label='角色'>
          {

              <Select>
                {
                  roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                }
              </Select>

        </Form.Item>*/}
      </Form>
    )
  }
}

export default UserForm