# Mall 电商前端

这是一个基于 Next.js 和 Vue 构建的现代化电商平台前端项目，对接 [mall](https://github.com/macrozheng/mall) 后端 API。

## 功能特性

### 已实现功能
- ✅ 首页商品展示
- ✅ 商品分类浏览
- ✅ 商品搜索
- ✅ 购物车管理
- ✅ 商品收藏
- ✅ 响应式设计

### API 接口对接

项目已对接以下 mall-portal 后端接口：

#### 商品相关 (PmsProductController)
- `GET /api/product/search` - 搜索商品
- `GET /api/product/detail/{id}` - 获取商品详情

#### 购物车相关 (OmsCartItemController)
- `GET /api/cart/list` - 获取购物车列表
- `POST /api/cart/add` - 添加商品到购物车
- `POST /api/cart/update/{id}` - 更新购物车商品数量
- `POST /api/cart/delete` - 删除购物车商品
- `POST /api/cart/clear` - 清空购物车

#### 用户相关 (UmsMemberController)
- `POST /api/member/register` - 用户注册
- `POST /api/member/login` - 用户登录
- `GET /api/member/info` - 获取用户信息
- `GET /api/member/getAuthCode` - 获取验证码

#### 订单相关 (OmsPortalOrderController)
- `POST /api/order/generateConfirmOrder` - 生成确认订单
- `POST /api/order/generateOrder` - 生成订单
- `GET /api/order/list` - 获取订单列表
- `GET /api/order/{orderId}` - 获取订单详情
- `POST /api/order/cancelOrder` - 取消订单

#### 收藏相关 (MemberProductCollectionController)
- `POST /api/member/productCollection/add` - 添加收藏
- `POST /api/member/productCollection/delete` - 取消收藏
- `GET /api/member/productCollection/list` - 获取收藏列表

#### 首页相关 (HomeController)
- `GET /api/home/content` - 获取首页内容
- `GET /api/home/productCateList/{parentId}` - 获取商品分类
- `GET /api/home/recommendProductList` - 获取推荐商品
- `GET /api/home/newProductList` - 获取新品推荐
- `GET /api/home/hotProductList` - 获取人气推荐

## 技术栈

- **框架**: Next.js 16 (App Router)
- **UI 库**: shadcn/ui
- **样式**: Tailwind CSS v4
- **图标**: lucide-react
- **语言**: TypeScript

## 环境配置

创建 `.env.local` 文件并配置后端 API 地址：

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## 快速开始

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 访问 http://localhost:3000

## 项目结构

```
├── app/                    # Next.js 应用目录
│   ├── page.tsx           # 首页
│   ├── cart/              # 购物车页面
│   ├── products/          # 商品页面
│   └── layout.tsx         # 根布局
├── components/            # React 组件
│   ├── layout/           # 布局组件 (Header, Footer)
│   ├── home/             # 首页组件
│   ├── products/         # 商品组件
│   └── cart/             # 购物车组件
├── lib/                   # 工具函数
│   └── api.ts            # API 接口封装
└── README.md
```

## API 使用示例

```typescript
import { productApi, cartApi } from '@/lib/api'

// 搜索商品
const products = await productApi.searchProducts('手机', 1, 20)

// 添加到购物车
await cartApi.addCartItem({ productId: 1, quantity: 1 })

// 获取购物车列表
const cartItems = await cartApi.getCartList()
```

## 后续开发计划

- [ ] 用户登录/注册页面
- [ ] 商品详情页面
- [ ] 订单管理页面
- [ ] 个人中心页面
- [ ] 收货地址管理
- [ ] 订单支付流程
- [ ] 评论系统

## 注意事项

1. 确保后端 mall-portal 服务已启动
2. 后端默认端口为 8080，可通过环境变量修改
3. 首次使用需要配置跨域支持

## License

MIT
```
