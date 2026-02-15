package com.workflowhub.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.workflowhub.backend.entity.User;
import com.workflowhub.backend.entity.Workflow;
import com.workflowhub.backend.entity.WorkflowStatus;
import com.workflowhub.backend.security.CustomUserDetails;
import com.workflowhub.backend.service.WorkflowService;
import com.workflowhub.backend.service.NotificationService;
import com.workflowhub.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/workflows")
public class UserWorkflowController {

    @Autowired 
    private WorkflowService workflowService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    /* =========================
       CREATE WORKFLOW
       ========================= */
    @PostMapping
    @PreAuthorize("hasAnyAuthority('EMPLOYEE','ADMIN')")
    public Workflow createWorkflow(
            @RequestBody Workflow workflow,
            Authentication authentication
    ) {
        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();

        User user = userDetails.getUser();

        workflow.setUser(user);

        Workflow savedWorkflow = workflowService.createWorkflow(workflow);

        // 🔔 Notify only admins (SAFE)
        List<User> admins = userRepository.findByRole(User.Role.ADMIN);

        for (User admin : admins) {
            notificationService.notify(
                admin,
                "New request submitted by " + user.getName()
            );
        }

        return savedWorkflow;
    }

    /* =========================
       MY WORKFLOWS
       ========================= */
    @GetMapping("/my")
    public List<Workflow> myWorkflows(Authentication authentication) {

        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();

        return workflowService.myWorkflows(
                userDetails.getUser().getId()
        );
    }
}
