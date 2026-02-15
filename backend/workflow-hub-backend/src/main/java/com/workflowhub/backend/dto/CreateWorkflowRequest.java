package com.workflowhub.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateWorkflowRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
