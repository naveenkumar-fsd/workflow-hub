package com.workflowhub.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendApprovalMail(String toEmail, String userName, String status) {

        System.out.println("DEBUG - Method entered");
        System.out.println("DEBUG - To Email: " + toEmail);

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("servesmart.notify@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Workflow Request Status Update");

        String body = "Hello " + userName + ",\n\n" +
                "Your request has been " + status + ".\n\n" +
                "Thank you,\nWorkflowPro Team";

        message.setText(body);

        mailSender.send(message);

        System.out.println("DEBUG - mailSender.send() executed");
    }

}
