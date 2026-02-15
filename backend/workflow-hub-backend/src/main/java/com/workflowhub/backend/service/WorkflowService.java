package com.workflowhub.backend.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.workflowhub.backend.entity.User;
import com.workflowhub.backend.entity.Workflow;
import com.workflowhub.backend.entity.WorkflowStatus;
import com.workflowhub.backend.repository.WorkflowRepository;

@Service
public class WorkflowService {

    @Autowired
    private WorkflowRepository workflowRepository;

    @Autowired
    private WorkflowEventService workflowEventService;

    /* =========================
       USER – CREATE WORKFLOW
       ========================= */
    public Workflow createWorkflow(Workflow workflow) {

        if (workflow.getUser() == null) {
            throw new RuntimeException("User not attached to workflow");
        }

        workflow.setStatus(WorkflowStatus.PENDING);

        Workflow saved = workflowRepository.save(workflow);

        if (saved.getUser() != null) {
            workflowEventService.logEvent(
                saved,
                WorkflowStatus.PENDING,
                "CREATED",
                saved.getUser().getEmail()
            );
        }

        return saved;
    }


    /* =========================
       USER – MY WORKFLOWS
       ========================= */
    public List<Workflow> myWorkflows(Long userId) {
        return workflowRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /* =========================
       ADMIN – PENDING QUEUE
       ========================= */
    public List<Workflow> pendingWorkflows() {
        return workflowRepository.findByStatusOrderByCreatedAtDesc(
            WorkflowStatus.PENDING
        );
    }

    /* =========================
       ADMIN – APPROVE
       ========================= */
    public Workflow approve(Long workflowId, User adminUser) {

        Workflow wf = workflowRepository.findById(workflowId)
            .orElseThrow(() -> new RuntimeException("Workflow not found"));

        wf.setStatus(WorkflowStatus.APPROVED);
        wf.setApprovedAt(LocalDateTime.now());
        wf.setApprovedBy(adminUser);

        Workflow saved = workflowRepository.save(wf);

        workflowEventService.logEvent(
            saved,
            WorkflowStatus.APPROVED,
            "APPROVED",
            adminUser.getEmail()
        );

        return saved;
    }

    /* =========================
       ADMIN – REJECT
       ========================= */
    public Workflow reject(Long workflowId, User adminUser) {

        Workflow wf = workflowRepository.findById(workflowId)
            .orElseThrow(() -> new RuntimeException("Workflow not found"));

        wf.setStatus(WorkflowStatus.REJECTED);
        wf.setApprovedAt(LocalDateTime.now());
        wf.setApprovedBy(adminUser);

        Workflow saved = workflowRepository.save(wf);

        workflowEventService.logEvent(
            saved,
            WorkflowStatus.REJECTED,
            "REJECTED",
            adminUser.getEmail()
        );

        return saved;
    }

    /* =========================
       EMPLOYEE – DASHBOARD COUNTS
       ========================= */
    public Map<String, Long> getUserDashboardSummary(Long userId) {

        Map<String, Long> map = new HashMap<>();

        map.put("total", workflowRepository.countByUserId(userId));
        map.put("pending",
                workflowRepository.countByUserIdAndStatus(userId, WorkflowStatus.PENDING));
        map.put("approved",
                workflowRepository.countByUserIdAndStatus(userId, WorkflowStatus.APPROVED));
        map.put("rejected",
                workflowRepository.countByUserIdAndStatus(userId, WorkflowStatus.REJECTED));

        return map;
    }

    /* =========================
       ADMIN – DASHBOARD COUNTS
       ========================= */
    public Map<String, Long> getAdminDashboardSummary() {

        Map<String, Long> map = new HashMap<>();

        map.put("pending",
                workflowRepository.countByStatus(WorkflowStatus.PENDING));
        map.put("approved",
                workflowRepository.countByStatus(WorkflowStatus.APPROVED));
        map.put("rejected",
                workflowRepository.countByStatus(WorkflowStatus.REJECTED));

        return map;
    }
}
