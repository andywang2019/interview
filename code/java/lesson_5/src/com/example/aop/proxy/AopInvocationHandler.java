package com.example.aop.proxy;

import com.example.aop.annotation.*;
import java.lang.reflect.*;

public class AopInvocationHandler implements InvocationHandler {
    private Object target;
    
    public AopInvocationHandler(Object target) {
        this.target = target;
    }
    private Method getTargetMethod(Method method) {
        try {
            return target.getClass().getMethod(method.getName(), method.getParameterTypes());
        } catch (NoSuchMethodException e) {
            return method; // 如果找不到，返回原方法
        }
    }
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        // 前置处理
        Method targetMethod = getTargetMethod(method);
        before(targetMethod);
        
        Object result = null;
        try {
            // 执行目标方法
            result = targetMethod.invoke(target, args);
            
            // 后置处理
            after(targetMethod);
            
        } catch (InvocationTargetException e) {
            // 异常处理
            Throwable cause = e.getCause();
            afterThrowing(targetMethod, cause);
            throw cause;
        }
        
        return result;
    }
    
    // 前置通知
    private void before(Method method) {
        if (method.isAnnotationPresent(Transactional.class)) {
            Transactional tx = method.getAnnotation(Transactional.class);
            System.out.println("  >>> [事务] 开启事务: " + tx.value());
        }
        
        if (method.isAnnotationPresent(Log.class)) {
            Log log = method.getAnnotation(Log.class);
            System.out.println("  >>> [日志] " + log.value() + " - " + method.getName());
        }
    }
    
    // 后置通知
    private void after(Method method) {
        if (method.isAnnotationPresent(Transactional.class)) {
            System.out.println("  <<< [事务] 提交事务");
        }
    }
    
    // 异常通知
    private void afterThrowing(Method method, Throwable e) {
        if (method.isAnnotationPresent(Transactional.class)) {
            System.out.println("  !!! [事务] 回滚事务: " + e.getMessage());
        }
    }
}
