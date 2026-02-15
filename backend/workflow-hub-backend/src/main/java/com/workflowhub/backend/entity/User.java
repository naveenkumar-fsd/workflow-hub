package com.workflowhub.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "users")
public class User {

    public enum Role {
        ADMIN,
        EMPLOYEE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private LocalDateTime createdAt;

    /* =====================================
       🔥 RELATIONSHIPS (VERY IMPORTANT)
       ===================================== */ 

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private java.util.List<Workflow> workflows;

    @OneToMany(mappedBy = "approvedBy")
    @JsonIgnore
    private List<Workflow> approvedWorkflows;


    /* =====================================
       JPA CALLBACK
       ===================================== */

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /* =====================================
       GETTERS / SETTERS
       ===================================== */

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public List<Workflow> getWorkflows() { return workflows; }

    public List<Workflow> getApprovedWorkflows() { return approvedWorkflows; }
}
