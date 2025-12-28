package org.example.techmaastudentportal.service;

import lombok.AllArgsConstructor;
import org.example.techmaastudentportal.dto.NotificationReqDTO;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service("emailNotification")
@AllArgsConstructor
public class EmailNotification implements Notification {

    private final JavaMailSender javaMailSender;
    public void sendNotification(NotificationReqDTO request){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(request.getTo());
        message.setSubject(request.getSubject());
        message.setText(request.getBody());
        javaMailSender.send(message);
    }

}
