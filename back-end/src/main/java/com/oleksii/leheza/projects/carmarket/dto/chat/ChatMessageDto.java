package com.oleksii.leheza.projects.carmarket.dto.chat;

import com.oleksii.leheza.projects.carmarket.enums.MessageStatus;
import lombok.*;

@Getter
@Setter
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDto {

    private String id;
    private String content;
    private String timestamp;
    private MessageStatus status;
}