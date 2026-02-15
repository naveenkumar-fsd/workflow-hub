package com.workflowhub.backend.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.workflowhub.backend.entity.Notification;
import com.workflowhub.backend.security.CustomUserDetails;
import com.workflowhub.backend.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService service;

    @GetMapping
    public List<Notification> myNotifications(Authentication auth) {
        CustomUserDetails u =
                (CustomUserDetails) auth.getPrincipal();

        return service.getUserNotifications(
                u.getUser().getId()
        );
    }
}
