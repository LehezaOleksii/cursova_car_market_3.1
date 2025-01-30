package com.oleksii.leheza.projects.carmarket.service.implementations;

import com.oleksii.leheza.projects.carmarket.dto.chat.ChatMessage;
import com.oleksii.leheza.projects.carmarket.dto.chat.ChatSendMessage;
import com.oleksii.leheza.projects.carmarket.dto.chat.ChatSendMessageStatus;
import com.oleksii.leheza.projects.carmarket.dto.mapper.DtoMapper;
import com.oleksii.leheza.projects.carmarket.entities.mongo.ChatMessageMongo;
import com.oleksii.leheza.projects.carmarket.entities.mongo.ChatRoom;
import com.oleksii.leheza.projects.carmarket.enums.MessageStatus;
import com.oleksii.leheza.projects.carmarket.exceptions.ResourceNotFoundException;
import com.oleksii.leheza.projects.carmarket.repositories.mogo.ChatMessageRepository;
import com.oleksii.leheza.projects.carmarket.repositories.mogo.ChatRoomRepository;
import com.oleksii.leheza.projects.carmarket.service.interfaces.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final DtoMapper dtoMapper;
    private final MongoTemplate mongoTemplate;

    @Override
    public ChatMessage createMessage(ChatSendMessage chatSendMessage) {
        Optional<ChatRoom> chatRoomOpt = chatRoomRepository.findByFirstUserAndSecondUserId(chatSendMessage.getSenderId(), chatSendMessage.getRecipientId());
        if (chatRoomOpt.isEmpty()) {
            throw new ResourceNotFoundException("Chat room between users " + chatSendMessage.getSenderId() + " and " + chatSendMessage.getRecipientId() + " does not exist");
        }
        ChatRoom chatRoom = chatRoomOpt.get();
        ChatMessageMongo chatMessageMongo =new ChatMessageMongo(chatSendMessage.getContent(), MessageStatus.SENT);
        chatMessageMongo.setId(UUID.randomUUID().toString());
        if (chatRoom.getFirstUserId().equals(chatSendMessage.getSenderId())) {
            chatRoom.getFirstUserMessages().add((chatMessageMongo));
        } else {
            chatRoom.getSecondUserMessages().add((chatMessageMongo));
        }
        chatRoomRepository.save(chatRoom);
        chatRoom.sortMessagesById(chatSendMessage.getSenderId());
        return dtoMapper.chatMessageEntityToChatMessage(chatMessageMongo, chatRoom.getFirstUserId());
    }

    @Override
    public ChatMessage changeMessageSatus(ChatSendMessageStatus chatSendMessageStatus) {
        Optional<ChatRoom> chatRoomOpt = chatRoomRepository.findByFirstUserAndSecondUserId(
                chatSendMessageStatus.getSenderId(), chatSendMessageStatus.getRecipientId());

        if (chatRoomOpt.isEmpty()) {
            throw new ResourceNotFoundException("Chat room between users "
                    + chatSendMessageStatus.getSenderId()
                    + " and " + chatSendMessageStatus.getRecipientId() + " does not exist");
        }

        ChatRoom chatRoom = chatRoomOpt.get();
        String messageId = chatSendMessageStatus.getMessageId();
        MessageStatus newStatus = MessageStatus.valueOf(chatSendMessageStatus.getStatus());

        boolean messageUpdated = updateMessageStatus(chatRoom.getFirstUserMessages(), messageId, newStatus);
        if (!messageUpdated) {
            messageUpdated = updateMessageStatus(chatRoom.getSecondUserMessages(), messageId, newStatus);
        }
        if (!messageUpdated) {
            throw new ResourceNotFoundException("Can't find message (" + messageId + ") in chat room");
        }
        chatRoomRepository.save(chatRoom);
        return dtoMapper.chatMessageEntityToChatSendMessageStatus(
                new ChatMessageMongo(messageId, newStatus), chatRoom.getFirstUserId());
    }

    private boolean updateMessageStatus(List<ChatMessageMongo> messages, String messageId, MessageStatus status) {
        for (ChatMessageMongo message : messages) {
            if (message.getId().equals(messageId)) {
                message.setStatus(status);
                return true;
            }
        }
        return false;
    }
}