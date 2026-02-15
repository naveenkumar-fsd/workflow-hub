package com.workflowhub.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workflowhub.backend.entity.WorkflowEvent;
import com.workflowhub.backend.service.WorkflowEventService;

@RestController
@RequestMapping("/api/workflows")
public class WorkflowEventController {

    @Autowired
    private WorkflowEventService workflowEventService;

    @GetMapping("/{id}/timeline")
    public List<WorkflowEvent> getTimeline(@PathVariable Long id) {
        return workflowEventService.getTimeline(id);
    }
}
