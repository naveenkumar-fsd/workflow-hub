package com.workflowhub.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.workflowhub.backend.repository.AuditLogRepository;
import com.workflowhub.backend.entity.AuditLog;

import java.util.List;

@RestController
@RequestMapping("/api/admin/audit")
public class AdminAuditController {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @GetMapping
    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }

    @GetMapping("/workflow")
    public List<AuditLog> workflowLogs() {
        return auditLogRepository.findByEntityType("Workflow");
    }
}
