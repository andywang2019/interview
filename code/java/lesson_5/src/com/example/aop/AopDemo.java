package com.example.aop;

import com.example.aop.proxy.AopProxyFactory;
import com.example.aop.service.*;

public class AopDemo {
    public static void main(String[] args) {
        System.out.println("=== AOP事务注入演示 ===\n");
        
        // 创建代理对象
        AccountService service = AopProxyFactory.createProxy(new AccountServiceImpl());
        
        // 测试1: 正常转账
        System.out.println("【测试1: 正常转账】");

        service.transfer("账户A", "账户B", 1000);

        // 测试2: 查询余额
        System.out.println("\n【测试2: 查询余额】");
        double balance = service.getBalance("账户A");
        System.out.println("  [结果] 余额: " + balance);
        
        // 测试3: 异常转账（触发回滚）
        System.out.println("\n【测试3: 异常转账 - 触发回滚】");
        try {
            service.transfer("账户A", "账户B", 20000);
        } catch (Exception e) {
            System.out.println("  [捕获异常] " + e.getMessage());
        }
    }
}
