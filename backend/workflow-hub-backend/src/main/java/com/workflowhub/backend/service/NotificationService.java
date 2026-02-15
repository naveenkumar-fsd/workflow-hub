package com.workflowhub.backend.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.workflowhub.backend.entity.Notification;
import com.workflowhub.backend.entity.User;
import com.workflowhub.backend.repository.NotificationRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repo;

    public void notify(User user, String message) {
        Notification n = new Notification();
        n.setUser(user);
        n.setMessage(message);
        n.setReadStatus(false); 
        repo.save(n);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
