package com.workflowhub.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workflowhub.backend.entity.WorkflowEvent;

@Repository
public interface WorkflowEventRepository
        extends JpaRepository<WorkflowEvent, Long> {

    List<WorkflowEvent> findByWorkflowIdOrderByCreatedAtAsc(Long workflowId);
}
