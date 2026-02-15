package com.workflowhub.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workflowhub.backend.dto.ApiResponse;
import com.workflowhub.backend.dto.UserProfileResponse;
import com.workflowhub.backend.entity.User;
import com.workflowhub.backend.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ApiResponse<UserProfileResponse> getProfile() {

        User user = userService.getLoggedInUser();

        UserProfileResponse profile = new UserProfileResponse(
        	    user.getName(),
        	    user.getEmail(),
        	    user.getRole().name()
        	);

        return new ApiResponse<>(
                true,
                "User profile fetched successfully",
                profile
        );
    }
}
