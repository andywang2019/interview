package com.govalley.yunhao.listener;

import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpSessionAttributeListener;
import jakarta.servlet.http.HttpSessionBindingEvent;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;

@Component
public class UserListener implements HttpSessionListener,HttpSessionAttributeListener {
    private static int onlineCount = 0;

    @Override
    public synchronized void sessionCreated(HttpSessionEvent se) {
        onlineCount++;
        System.out.println("当前在线人数：" + onlineCount);
    }

    @Override
    public synchronized void sessionDestroyed(HttpSessionEvent se) {
        onlineCount--;
        System.out.println("当前在线人数：" + onlineCount);
    }

    public static int getOnlineCount() {
        return onlineCount;
    }
    @Override
    public void attributeAdded(HttpSessionBindingEvent event) {
        System.out.println("➕ Session 属性添加：" 
            + event.getName() + "=" + event.getValue());
    }

    @Override
    public void attributeRemoved(HttpSessionBindingEvent event) {
        System.out.println("➖ Session 属性删除：" 
            + event.getName());
    }

    @Override
    public void attributeReplaced(HttpSessionBindingEvent event) {
        System.out.println("♻️ Session 属性修改：" 
            + event.getName() + "=" + event.getSession().getAttribute(event.getName()));
    }

}
