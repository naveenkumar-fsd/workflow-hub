package com.workflowhub.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.workflowhub.backend.entity.AuditLog;
import com.workflowhub.backend.repository.AuditLogRepository;

import java.time.LocalDateTime;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void log(
            String action,
            String entityType,
            Long entityId,
            Authentication auth
    ) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setPerformedBy(auth.getName());
        log.setRole(
            auth.getAuthorities().iterator().next().getAuthority()
        );
        log.setCreatedAt(LocalDateTime.now());

        auditLogRepository.save(log);
    }
}
