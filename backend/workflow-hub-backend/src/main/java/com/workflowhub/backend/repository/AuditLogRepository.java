package com.workflowhub.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.workflowhub.backend.entity.AuditLog;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByPerformedBy(String email);

    List<AuditLog> findByEntityType(String entityType);
}
