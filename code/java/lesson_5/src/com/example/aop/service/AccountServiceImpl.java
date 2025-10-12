package com.example.aop.service;

import com.example.aop.annotation.*;

public class AccountServiceImpl implements AccountService {
    
    @Transactional("转账事务")
    @Log("转账操作")
    @Override
    public void transfer(String from, String to, double amount) {
       // System.out.println("      [业务] 执行转账: " + from + " -> " + to + ", 金额: " + amount);
A();
B();
        
        // 模拟异常
        if (amount > 10000) {
            throw new RuntimeException("转账金额超限");
        }
    }

    //事务传播
    @Transactional("转账事务")
    void A(){

    }
    @Transactional("转账事务")
    void B(){

    }


    @Log("查询余额")
    @Override
    public double getBalance(String account) {
        System.out.println("      [业务] 查询账户余额: " + account);
        return 5000.0;
    }
}
