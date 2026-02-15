package com.workflowhub.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.workflowhub.backend.entity")
public class WorkflowHubBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(WorkflowHubBackendApplication.class, args);
    }
}
