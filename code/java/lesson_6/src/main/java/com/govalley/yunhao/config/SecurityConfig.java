package com.govalley.yunhao.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                // ✅ allow Swagger endpoints
               // .requestMatchers(
               //     "/v3/api-docs/**",
               //     "/swagger-ui.html",
               //     "/swagger-ui/**",
               //     "/swagger-resources/**",
               //     "/webjars/**"
              //  ).permitAll()
               // .anyRequest().authenticated()
                    .requestMatchers("/**").permitAll()
                    .anyRequest().permitAll()
            )
            .csrf(csrf -> csrf.disable())    // disable CSRF for testing
            .formLogin(login -> login.disable())  // disable default login form
            .httpBasic(basic -> basic.disable()); // disable basic auth

        return http.build();
    }
}
