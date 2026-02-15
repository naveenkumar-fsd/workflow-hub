package com.workflowhub.backend.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "workflows")
public class Workflow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    /* =========================
       CREATED BY (EMPLOYEE)
       ========================= */
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"password", "workflows"})
    private User user;

    /* =========================
       STATUS
       ========================= */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkflowStatus status = WorkflowStatus.PENDING;

    /* =========================
       APPROVED BY (ADMIN)
       ========================= */
    @ManyToOne
    @JoinColumn(name = "approved_by")
    @JsonIgnoreProperties({"password", "workflows"})
    private User approvedBy;

    /* =========================
       TIMESTAMPS
       ========================= */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime approvedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /* =========================
       GETTERS & SETTERS
       ========================= */

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }

    public WorkflowStatus getStatus() { return status; }

    public void setStatus(WorkflowStatus status) { this.status = status; }

    public User getApprovedBy() { return approvedBy; }

    public void setApprovedBy(User approvedBy) { this.approvedBy = approvedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getApprovedAt() { return approvedAt; }

    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
}
