package com.oleksii.leheza.projects.carmarket.service.implementations;

import com.oleksii.leheza.projects.carmarket.entities.User;
import com.oleksii.leheza.projects.carmarket.entities.chat.Chat;
import com.oleksii.leheza.projects.carmarket.entities.chat.ChatMessage;
import com.oleksii.leheza.projects.carmarket.repositories.ChatMessageRepository;
import com.oleksii.leheza.projects.carmarket.repositories.ChatRepository;
import com.oleksii.leheza.projects.carmarket.service.interfaces.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;

    @Override
    public Chat createChat(User userOne, User userTwo) {
        Chat chat = Chat.builder()
                .userOne(userOne)
                .userTwo(userTwo)
                .build();
        return chatRepository.save(chat);
    }

    @Override
    public List<Chat> getUserChats(User user) {
        return chatRepository.findByUserOneOrUserTwo(user, user);
    }

    @Override
    public ChatMessage addMessage(Chat chat, User sender, String content) {
        ChatMessage message = ChatMessage.builder()
                .chat(chat)
                .sender(sender)
                .content(content)
                .timestamp(LocalDateTime.now())
                .build();
        return chatMessageRepository.save(message);
    }

    @Override
    public List<ChatMessage> getChatMessages(Chat chat) {
        return chatMessageRepository.findByChat(chat);
    }
}