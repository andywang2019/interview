package com.govalley.yunhao.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("订单管理系统 API 文档")
                        .version("1.0.0")
                        .description("基于 Spring Boot + Gradle + PostgreSQL 的订单管理接口示例")
                        .contact(new Contact()
                                .name("技术支持")
                                .email("support@example.com")
                                .url("https://example.com")));
    }
}

