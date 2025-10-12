package com.example.aop.service;

public interface AccountService {
    void transfer(String from, String to, double amount);
    double getBalance(String account);
}
