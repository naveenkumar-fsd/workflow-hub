package com.workflowhub.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.workflowhub.backend.entity.Workflow;
import com.workflowhub.backend.entity.WorkflowEvent;
import com.workflowhub.backend.entity.WorkflowStatus;
import com.workflowhub.backend.repository.WorkflowEventRepository;

@Service
public class WorkflowEventService {

    @Autowired
    private WorkflowEventRepository eventRepository;

    public void logEvent(
            Workflow workflow,
            WorkflowStatus status,
            String action,
            String performedBy
    ) {
        WorkflowEvent event = new WorkflowEvent();
        event.setWorkflow(workflow);
        event.setStatus(status);
        event.setAction(action);
        event.setPerformedBy(performedBy);

        eventRepository.save(event);
    }

    public List<WorkflowEvent> getTimeline(Long workflowId) {
        return eventRepository.findByWorkflowIdOrderByCreatedAtAsc(workflowId);
    }
}
