package org.example.techmaastudentportal.service;

import org.example.techmaastudentportal.dto.NotificationReqDTO;

public interface Notification {

    public void sendNotification(NotificationReqDTO request);
}
