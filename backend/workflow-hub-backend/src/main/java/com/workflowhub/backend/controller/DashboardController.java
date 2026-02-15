package com.workflowhub.backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.workflowhub.backend.security.CustomUserDetails;
import com.workflowhub.backend.service.WorkflowService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private WorkflowService workflowService;

    /* ============================
       EMPLOYEE DASHBOARD
       ============================ */
    @GetMapping("/employee")
    public Map<String, Long> employeeDashboard(Authentication authentication) {

        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();

        Long userId = userDetails.getUser().getId();

        return workflowService.getUserDashboardSummary(userId);
    }

    /* ============================
       ADMIN DASHBOARD
       ============================ */
    @GetMapping("/admin")
    public Map<String, Long> adminDashboard() {
        return workflowService.getAdminDashboardSummary();
    }
}
