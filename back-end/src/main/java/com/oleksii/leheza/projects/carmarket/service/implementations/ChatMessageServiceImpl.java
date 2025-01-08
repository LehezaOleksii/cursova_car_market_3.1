package com.oleksii.leheza.projects.carmarket.service.implementations;

import com.oleksii.leheza.projects.carmarket.dto.chat.ChatMessageDto;
import com.oleksii.leheza.projects.carmarket.dto.chat.ChatSendMessage;
import com.oleksii.leheza.projects.carmarket.dto.mapper.DtoMapper;
import com.oleksii.leheza.projects.carmarket.entities.mongo.ChatMessage;
import com.oleksii.leheza.projects.carmarket.entities.mongo.ChatRoom;
import com.oleksii.leheza.projects.carmarket.enums.MessageStatus;
import com.oleksii.leheza.projects.carmarket.exceptions.ResourceNotFoundException;
import com.oleksii.leheza.projects.carmarket.repositories.mogo.ChatMessageRepository;
import com.oleksii.leheza.projects.carmarket.repositories.mogo.ChatRoomRepository;
import com.oleksii.leheza.projects.carmarket.service.interfaces.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final MongoOperations mongoOperations;
    private final DtoMapper dtoMapper;

    @Override
    public ChatMessageDto createMessage(ChatSendMessage chatSendMessage) {
        Optional<ChatRoom> chatRoomOpt = chatRoomRepository.findByFirstUserAndSecondUserId(chatSendMessage.getSenderId(), chatSendMessage.getRecipientId());
        if (chatRoomOpt.isEmpty()) {
            throw new ResourceNotFoundException("Chat room between users " + chatSendMessage.getSenderId() + " and " + chatSendMessage.getRecipientId() + " does not exist");
        }
        ChatRoom chatRoom = chatRoomOpt.get();
        ChatMessage chatMessage = chatMessageRepository.save(new ChatMessage(chatSendMessage.getContent()));
        if (chatRoom.getFirstUserId().equals(chatSendMessage.getSenderId())) {
            chatRoom.getFirstUserMessages().add((chatMessage));
        } else {
            chatRoom.getSecondUserMessages().add((chatMessage));
        }
        chatRoomRepository.save(chatRoom);
        return dtoMapper.chatMessageEntityToChatMessageDto(chatMessage);
    }

    @Override
    public ChatMessage findById(String id) {
        return chatMessageRepository
                .findById(id)
                .map(chatMessage -> {
                    chatMessage.setStatus(MessageStatus.DELIVERED);
                    return chatMessageRepository.save(chatMessage);
                })
                .orElseThrow(() ->
                        new ResourceNotFoundException("can't find message (" + id + ")"));
    }

    @Override
    public void updateStatuses(String senderId, String recipientId, MessageStatus status) {
        Query query = new Query(Criteria
                .where("senderId").is(senderId)
                .and("recipientId").is(recipientId));
        Update update = Update.update("status", status);
        mongoOperations.updateMulti(query, update, ChatMessage.class);
    }
}