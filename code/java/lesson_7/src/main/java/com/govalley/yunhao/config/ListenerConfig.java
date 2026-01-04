package com.govalley.yunhao.config;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.govalley.yunhao.listener.MySessionAttrListener;
@Configuration
public class ListenerConfig {
    @Bean
    public ServletListenerRegistrationBean<MySessionAttrListener> sessionListener() {
        return new ServletListenerRegistrationBean<>(new MySessionAttrListener());
    }
}
