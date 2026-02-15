package com.workflowhub.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workflowhub.backend.entity.Workflow;
import com.workflowhub.backend.entity.WorkflowStatusHistory;

public interface WorkflowStatusHistoryRepository
        extends JpaRepository<WorkflowStatusHistory, Long> {

    List<WorkflowStatusHistory> findByWorkflowOrderByActionAtAsc(Workflow workflow);
}
