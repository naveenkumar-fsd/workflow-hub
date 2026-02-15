package com.workflowhub.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.workflowhub.backend.entity.*;
import com.workflowhub.backend.repository.WorkflowStatusHistoryRepository;

@Service
public class WorkflowTimelineService {

    @Autowired
    private WorkflowStatusHistoryRepository historyRepo;

    public void log(
            Workflow workflow,
            WorkflowStatus status,
            String action,
            String actionBy
    ) {
        WorkflowStatusHistory h = new WorkflowStatusHistory();
        h.setWorkflow(workflow);
        h.setStatus(status);
        h.setAction(action);
        h.setActionBy(actionBy);
        h.setActionAt(LocalDateTime.now());

        historyRepo.save(h);
    }

    public List<WorkflowStatusHistory> getTimeline(Workflow workflow) {
        return historyRepo.findByWorkflowOrderByActionAtAsc(workflow);
    }
}
