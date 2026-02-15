package com.workflowhub.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "workflow_events")
public class WorkflowEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* =========================
       RELATION
       ========================= */
    @ManyToOne(optional = false)
    @JoinColumn(name = "workflow_id")
    private Workflow workflow;

    /* =========================
       EVENT DATA
       ========================= */
    @Enumerated(EnumType.STRING)
    private WorkflowStatus status;

    private String action;      // CREATED / APPROVED / REJECTED
    private String performedBy; // email

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /* =========================
       GETTERS & SETTERS
       ========================= */

    public void setWorkflow(Workflow workflow) {
        this.workflow = workflow;
    }

    public void setStatus(WorkflowStatus status) {
        this.status = status;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }
}
