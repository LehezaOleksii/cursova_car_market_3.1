package com.oleksii.leheza.projects.carmarket.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatNotification {

    private String id;
    private String senderId;
    private String senderName;
}