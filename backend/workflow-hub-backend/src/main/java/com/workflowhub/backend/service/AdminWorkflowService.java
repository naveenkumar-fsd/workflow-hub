package com.workflowhub.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.workflowhub.backend.entity.Workflow;
import com.workflowhub.backend.entity.WorkflowStatus;
import com.workflowhub.backend.entity.User;
import com.workflowhub.backend.repository.WorkflowRepository;
import com.workflowhub.backend.security.CustomUserDetails;

@Service
public class AdminWorkflowService {

    @Autowired
    private WorkflowRepository workflowRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private MailService mailService;

    /* ===============================
       APPROVE WORKFLOW
       =============================== */
    public Workflow approveWorkflow(Long id, Authentication authentication) {

        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workflow not found"));

        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();

        User admin = userDetails.getUser();

        workflow.setStatus(WorkflowStatus.APPROVED);
        workflow.setApprovedBy(admin);
        workflow.setApprovedAt(java.time.LocalDateTime.now());

        Workflow saved = workflowRepository.save(workflow);

        User employee = workflow.getUser();

        if (employee != null) {

            // 🔍 DEBUG – Check email value
            System.out.println("Sending mail to: " + employee.getEmail());

            // 🔔 In-App Notification
            notificationService.notify(
                    employee,
                    "Your request '" + workflow.getTitle() + "' was APPROVED"
            );

            // 📧 Send Email
            try {
                if (employee.getEmail() != null && !employee.getEmail().isBlank()) {

                    mailService.sendApprovalMail(
                            employee.getEmail().trim(),   // trim safety
                            employee.getName(),
                            "APPROVED"
                    );

                    System.out.println("Mail send triggered successfully");

                } else {
                    System.out.println("User email is null or blank. Skipping mail.");
                }

            } catch (Exception e) {
                System.out.println("Email sending failed: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Workflow user is null. Cannot send email.");
        }

        return saved;
    }

    /* ===============================
       REJECT WORKFLOW
       =============================== */
    public Workflow rejectWorkflow(Long id, Authentication authentication) {

        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workflow not found"));

        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();

        User admin = userDetails.getUser();

        workflow.setStatus(WorkflowStatus.REJECTED);
        workflow.setApprovedBy(admin);
        workflow.setApprovedAt(java.time.LocalDateTime.now());

        Workflow saved = workflowRepository.save(workflow);

        User employee = workflow.getUser();

        if (employee != null) {

            // 🔍 DEBUG – Check email value
            System.out.println("Sending mail to: " + employee.getEmail());

            // 🔔 In-App Notification
            notificationService.notify(
                    employee,
                    "Your request '" + workflow.getTitle() + "' was REJECTED"
            );

            // 📧 Send Email
            try {
                if (employee.getEmail() != null && !employee.getEmail().isBlank()) {

                    mailService.sendApprovalMail(
                            employee.getEmail().trim(),
                            employee.getName(),
                            "REJECTED"
                    );

                    System.out.println("Mail send triggered successfully");

                } else {
                    System.out.println("User email is null or blank. Skipping mail.");
                }

            } catch (Exception e) {
                System.out.println("Email sending failed: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Workflow user is null. Cannot send email.");
        }

        return saved;
    }

    /* ===============================
       GET PENDING WORKFLOWS
       =============================== */
    public List<Workflow> getPendingWorkflows() {
        return workflowRepository
                .findByStatusOrderByCreatedAtDesc(WorkflowStatus.PENDING);
    }
}
