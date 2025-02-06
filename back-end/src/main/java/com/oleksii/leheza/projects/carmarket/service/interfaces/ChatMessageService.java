package com.oleksii.leheza.projects.carmarket.service.interfaces;

import com.oleksii.leheza.projects.carmarket.dto.chat.ChatSendMessage;
import com.oleksii.leheza.projects.carmarket.dto.chat.ChatSendMessageStatus;
import com.oleksii.leheza.projects.carmarket.dto.chat.ChatMessage;
import org.springframework.stereotype.Service;

@Service
public interface ChatMessageService {

    ChatMessage createMessage(ChatSendMessage chatMessage);

    ChatMessage changeMessageStatus(ChatSendMessageStatus chatSendMessageStatus);
}
