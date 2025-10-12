package com.govalley.yunhao;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EntityScan("com.govalley.yunhao.entity")
@EnableJpaRepositories("com.govalley.yunhao.repo")
@SpringBootApplication
public class Lesson6Application {

	public static void main(String[] args) {
		SpringApplication.run(Lesson6Application.class, args);
	}

}
