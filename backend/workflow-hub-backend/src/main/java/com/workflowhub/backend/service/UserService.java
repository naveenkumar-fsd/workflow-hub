package com.workflowhub.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.workflowhub.backend.entity.User;
import com.workflowhub.backend.exception.ResourceNotFoundException;
import com.workflowhub.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired 
    private UserRepository userRepository;

    public User getLoggedInUser() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    }
}
