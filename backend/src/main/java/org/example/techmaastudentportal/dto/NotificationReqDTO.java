package org.example.techmaastudentportal.dto;

import lombok.Data;

@Data
public class NotificationReqDTO {
    private String to;
    private String subject;
    private String body;
}