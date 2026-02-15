package com.workflowhub.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.workflowhub.backend.entity.Workflow;
import com.workflowhub.backend.service.AdminWorkflowService;

@RestController
@RequestMapping("/api/admin/workflows")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminWorkflowController {

    @Autowired
    private AdminWorkflowService adminWorkflowService;

    /* =========================
       GET PENDING WORKFLOWS
       ========================= */
    @GetMapping("/pending")
    public ResponseEntity<List<Workflow>> getPendingWorkflows() {
        return ResponseEntity.ok(
                adminWorkflowService.getPendingWorkflows()
        );
    }

    /* =========================
       APPROVE
       ========================= */
    @PutMapping("/{id}/approve")
    public ResponseEntity<Workflow> approveWorkflow(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Workflow updated = adminWorkflowService.approveWorkflow(id, authentication);
        return ResponseEntity.ok(updated);
    }

    /* =========================
       REJECT
       ========================= */
    @PutMapping("/{id}/reject")
    public ResponseEntity<Workflow> rejectWorkflow(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Workflow updated = adminWorkflowService.rejectWorkflow(id, authentication);
        return ResponseEntity.ok(updated);
    }
}
