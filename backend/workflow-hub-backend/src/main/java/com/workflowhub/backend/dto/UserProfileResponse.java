package com.workflowhub.backend.dto;

public class UserProfileResponse {

    private String name;
    private String email;
    private String role;

    public UserProfileResponse(String name, String email, String role) {
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}
