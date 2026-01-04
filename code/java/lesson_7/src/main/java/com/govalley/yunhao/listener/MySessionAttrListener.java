package com.govalley.yunhao.listener;
import jakarta.servlet.http.HttpSessionAttributeListener;
import jakarta.servlet.http.HttpSessionBindingEvent;
import org.springframework.stereotype.Component;

@Component
public class MySessionAttrListener implements HttpSessionAttributeListener {

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
