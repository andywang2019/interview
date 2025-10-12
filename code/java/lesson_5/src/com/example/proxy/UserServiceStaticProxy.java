package com.example.proxy;

// ========== 静态代理 ==========
class UserServiceStaticProxy implements UserService {
    private UserService target;
    
    public UserServiceStaticProxy(UserService target) {
        this.target = target;
    }
    
    @Override
    public void save(String user) {
        System.out.println("【代理】开始事务");
        target.save(user);
        System.out.println("【代理】提交事务");
    }
    
    @Override
    public String query(String id) {
        System.out.println("【代理】开始事务");
        String result = target.query(id);
        System.out.println("【代理】提交事务");
        return result;
    }
    public static void main(String[] args) {
        System.out.println("=== JDK动态代理演示 ===\n");

        // 创建真实对象
        UserService userService = new UserServiceImpl();

        // 创建代理对象
        UserService proxy = new UserServiceStaticProxy(userService);

        // 通过代理调用方法
        System.out.println(">>> 调用 save 方法:");
        proxy.save("张三");

        //System.out.println("\n>>> 调用 query 方法:");
        //String result = proxy.query("001");
        //System.out.println("  [返回结果] " + result);
    }
}