package com.example.proxy;

import java.lang.reflect.*;

// 业务接口
interface UserService {
    void save(String user);
    String query(String id);
}

// 真实业务实现
class UserServiceImpl implements UserService {
    @Override
    public void save(String user) {
        System.out.println("    [业务层] 保存用户: " + user);
    }
    
    @Override
    public String query(String id) {
        System.out.println("    [业务层] 查询用户: " + id);
        return "User-" + id;
    }
}

// 动态代理处理器
class TransactionInvocationHandler implements InvocationHandler {
    private Object target; // 被代理的真实对象
    
    public TransactionInvocationHandler(Object target) {
        this.target = target;
    }
    
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("  [代理] 开始事务");
        System.out.println("  [代理] 执行方法: " + method.getName());
        
        try {
            // 调用真实对象的方法
            Object result = method.invoke(target, args);
            
            System.out.println("  [代理] 提交事务");
            return result;
            
        } catch (Exception e) {
            System.out.println("  [代理] 回滚事务");
            throw e;
        }
    }
}

// 代理工厂
class ProxyFactory {
    @SuppressWarnings("unchecked")
    public static <T> T createProxy(T target) {
        return (T) Proxy.newProxyInstance(
            target.getClass().getClassLoader(),
            target.getClass().getInterfaces(),
            new TransactionInvocationHandler(target)
        );
    }
}

// 测试类
public class JDKProxyDemo {
    public static void main(String[] args) {
        System.out.println("=== JDK动态代理演示 ===\n");
        
        // 创建真实对象
        UserService userService = new UserServiceImpl();
        
        // 创建代理对象
        UserService proxy = ProxyFactory.createProxy(userService);
        
        // 通过代理调用方法
        System.out.println(">>> 调用 save 方法:");
        proxy.save("张三");
        
        System.out.println("\n>>> 调用 query 方法:");
        String result = proxy.query("001");
        System.out.println("  [返回结果] " + result);
    }
}
