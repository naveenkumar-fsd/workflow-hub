package com.workflowhub.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workflowhub.backend.entity.Workflow;
import com.workflowhub.backend.entity.WorkflowStatus;

@Repository
public interface WorkflowRepository extends JpaRepository<Workflow, Long> {

    /* ===============================
       EMPLOYEE – MY REQUESTS
       =============================== */

    List<Workflow> findByUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, WorkflowStatus status);

    /* ===============================
       ADMIN – APPROVAL QUEUE
       =============================== */

    List<Workflow> findByStatusOrderByCreatedAtDesc(WorkflowStatus status);

    long countByStatus(WorkflowStatus status);

    /* ===============================
       ADMIN – HISTORY
       =============================== */

    List<Workflow> findByApprovedByIdOrderByApprovedAtDesc(Long adminId);
}
