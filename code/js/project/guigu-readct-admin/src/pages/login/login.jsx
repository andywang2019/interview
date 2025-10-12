import React, {Component} from 'react'
import {Navigate,useNavigate } from 'react-router-dom'
import { SmileOutlined ,UserAddOutlined,NumberOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  Button,
  message
} from 'antd'
import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import withRouter from "../../utils/withRouter";


const Item = Form.Item // 不能写在import之前


/*
登陆的路由组件
 */
class Login extends Component {

  formRef = React.createRef(); // <-- Form ref
  handleSubmit=()=>{
    this.formRef.current
        .validateFields()
        .then(async (values) => {
            console.log(values);
            const result = { username: "admin", password: "admin" }//await reqLogin(values.username, values.password) // {status: 0, data: user}  {status: 1, msg: 'xxx'}
             console.log('请求成功', result)
            if (result.status===0) { // 登陆成功
                // 提示登陆成功
                message.success(' test 登陆成功')

                // 保存user
                const user = result.data
                memoryUtils.user = user // 保存在内存中
                storageUtils.saveUser(user) // 保存到local中

                // 跳转到管理界面 (不需要再回退回到登陆)
              //  this.props.history.replace('/')
               this.props.navigate('/', { replace: true })
            } else { // 登陆失败
                // 提示错误信息
                message.error(result.msg)
            }
        })
        .catch((error) => {
            console.log(error);
        });
  }
  handleFinish = async (event) => {



   /* // 对所有表单字段进行检验
    this.props.formRef.validateFields(async (err, values) => {
      // 检验成功
      if (!err) {
        // console.log('提交登陆的ajax请求', values)
        // 请求登陆
        const {username, password} = values
        const result = await reqLogin(username, password) // {status: 0, data: user}  {status: 1, msg: 'xxx'}
        // console.log('请求成功', result)
        if (result.status===0) { // 登陆成功
          // 提示登陆成功
          message.success('登陆成功')

          // 保存user
          const user = result.data
          memoryUtils.user = user // 保存在内存中
          storageUtils.saveUser(user) // 保存到local中

          // 跳转到管理界面 (不需要再回退回到登陆)
          this.props.history.replace('/')

        } else { // 登陆失败
          // 提示错误信息
          message.error(result.msg)
        }

      } else {
        console.log('检验失败!')
      }
    });*/

    // 得到form对象
    // const form = this.props.form
    // // 获取表单项的输入数据
    // const values = form.getFieldsValue()
    // console.log('handleSubmit()', values)
  }

  /*
  对密码进行自定义验证
  */
  /*
   用户名/密码的的合法性要求
     1). 必须输入
     2). 必须大于等于4位
     3). 必须小于等于12位
     4). 必须是英文、数字或下划线组成
    */
 /* validatePwd = (rule, value, callback) => {
    console.log('validatePwd()', rule, value)
    if(!value) {
      callback('密码必须输入')
    } else if (value.length<4) {
      callback('密码长度不能小于4位')
    } else if (value.length>12) {
      callback('密码长度不能大于12位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须是英文、数字或下划线组成')
    } else {
      callback() // 验证通过
    }
    // callback('xxxx') // 验证失败, 并指定提示的文本
  }*/

  render () {

    // 如果用户已经登陆, 自动跳转到管理界面
    const user = memoryUtils.user
    if(user && user._id) {
      return <Navigate to='/'/>
    }

    // 得到具强大功能的form对象


    return (
      <div className="login" align="middle">
        <header className="login-header">
          <img src={logo} alt="logo"/>
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className="login-content" >
          <h2>用户登陆</h2>
          <Form ref={this.formRef} onFinish={this.handleFinish}     wrapperCol={{ span: 16 }}   style={{ maxWidth: 600 }}>
            <Form.Item name="username" label="Username"
                       rules={[
                         { required: true, message: 'Please enter your username!' },
                         { min: 4, message: 'Username must be at least 4 characters!' },
                       ]}>
              {
                /*
              用户名/密码的的合法性要求
                1). 必须输入
                2). 必须大于等于4位
                3). 必须小于等于12位
                4). 必须是英文、数字或下划线组成
               */
              }

                  <Input placeholder="用户名"/>


            </Form.Item>
            <Form.Item name="password" label="password" rules={[{ required: true }]}>
              <Input type="password" placeholder="密码"
                  />


            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={this.handleSubmit} className="login-form-button">
                登陆
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}

/*
1. 高阶函数
    1). 一类特别的函数
        a. 接受函数类型的参数
        b. 返回值是函数
    2). 常见
        a. 定时器: setTimeout()/setInterval()
        b. Promise: Promise(() => {}) then(value => {}, reason => {})
        c. 数组遍历相关的方法: forEach()/filter()/map()/reduce()/find()/findIndex()
        d. 函数对象的bind()
        e. Form.create()() / getFieldDecorator()()
    3). 高阶函数更新动态, 更加具有扩展性

2. 高阶组件
    1). 本质就是一个函数
    2). 接收一个组件(被包装组件), 返回一个新的组件(包装组件), 包装组件会向被包装组件传入特定属性
    3). 作用: 扩展组件的功能
    4). 高阶组件也是高阶函数: 接收一个组件函数, 返回是一个新的组件函数
 */
/*
包装Form组件生成一个新的组件: Form(Login)
新组件会向Form组件传递一个强大的对象属性: form
 */
//const [WrapLogin] = Form.useForm()(Login)
//export default WrapLogin
export default withRouter(Login);
/*
1. 前台表单验证
2. 收集表单输入数据
 */

/*
async和await
1. 作用?
   简化promise对象的使用: 不用再使用then()来指定成功/失败的回调函数
   以同步编码(没有回调函数了)方式实现异步流程
2. 哪里写await?
    在返回promise的表达式左侧写await: 不想要promise, 想要promise异步执行的成功的value数据
3. 哪里写async?
    await所在函数(最近的)定义的左侧写async
 */