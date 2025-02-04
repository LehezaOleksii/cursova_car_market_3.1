package com.oleksii.leheza.projects.carmarket.service.implementations;

import com.oleksii.leheza.projects.carmarket.dto.chat.ChatHistory;
import com.oleksii.leheza.projects.carmarket.dto.chat.UserChatName;
import com.oleksii.leheza.projects.carmarket.dto.mapper.DtoMapper;
import com.oleksii.leheza.projects.carmarket.entities.mongo.ChatMessageMongo;
import com.oleksii.leheza.projects.carmarket.entities.mongo.ChatRoom;
import com.oleksii.leheza.projects.carmarket.enums.MessageStatus;
import com.oleksii.leheza.projects.carmarket.repositories.mogo.ChatRoomRepository;
import com.oleksii.leheza.projects.carmarket.repositories.sql.UserRepository;
import com.oleksii.leheza.projects.carmarket.service.interfaces.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatRoomServiceImpl implements ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final DtoMapper dtoMapper;

    @Override
    public void createChatRoom(String senderId, String recipientId) {
        ChatRoom chatRoom = ChatRoom.builder()
                .firstUserId(senderId)
                .secondUserId(recipientId)
                .build();
        chatRoomRepository.save(chatRoom);
    }

    @Override
    public Optional<ChatRoom> getChat(String senderId, String recipientId) {
        return chatRoomRepository.findByFirstUserAndSecondUserId(senderId, recipientId);
    }

    @Override
    public ChatHistory retrieveChatHistory(String firstUserId, String secondUserId) {
        Optional<ChatRoom> chatRoomOpt = chatRoomRepository.findByFirstUserAndSecondUserId(firstUserId, secondUserId);
        if (chatRoomOpt.isPresent()) {
            ChatRoom chatRoom = chatRoomOpt.get();
            chatRoom.sortMessagesById(firstUserId);
            return dtoMapper.chatRoomToChatHistory(chatRoom);
        }
        return new ChatHistory();
    }

    @Override
    public List<UserChatName> getUserChats(String userId) {
        List<ChatRoom> chatRooms = chatRoomRepository.getUserChatRoomIdsByUserId(userId);
        List<Long> userIds = chatRooms.stream()
                .map(c -> c.getFirstUserId().equals(userId) ? c.getSecondUserId() : c.getFirstUserId())
                .map(Long::valueOf)
                .toList();
        List<UserChatName> userChats = userRepository.getUserChatNamesByIds(userIds);
        userChats
                .forEach(userChat -> {
                    Optional<ChatRoom> chatRoomOpt = chatRoomRepository.findByFirstUserAndSecondUserId(userId, String.valueOf(userChat.getId()));
                    chatRoomOpt.ifPresent(chatRoom -> {
                        if (chatRoom.getLastChatMessage().isPresent()) {
                            ChatMessageMongo chatMessageMongo = chatRoom.getLastChatMessage().get();
                            userChat.setLastMessage(chatMessageMongo);
                        }
                    });
                });
        userChats.forEach(userChat -> {
            Optional<ChatRoom> chatRoomOpt = chatRoomRepository.findByFirstUserAndSecondUserId(userId, String.valueOf(userChat.getId()));
            chatRoomOpt.ifPresent(chatRoom -> {
                chatRoom.sortMessagesById(String.valueOf(userId));
                int unreadMessagesCount = (int)
                        chatRoom.getSecondUserMessages().stream()
                                .filter(msg -> msg.getStatus() == MessageStatus.SENT)
                                .count();
                userChat.setUnreadMessages(unreadMessagesCount);
            });
        });
        return userChats;
    }

    @Override
    public List<UserChatName> getUserChatsByName(String id, String name) {
        List<UserChatName> userChats = userRepository.getUserChatNamesByName(name);
        userChats
                .forEach(userChat -> {
                    Optional<ChatRoom> chatRoomOpt = chatRoomRepository.findByFirstUserAndSecondUserId(id, String.valueOf(userChat.getId()));
                    chatRoomOpt.ifPresent(chatRoom -> {
                        if (chatRoom.getLastChatMessage().isPresent()) {
                            ChatMessageMongo chatMessageMongo = chatRoom.getLastChatMessage().get();
                            userChat.setLastMessage(chatMessageMongo);
                        }
                    });
                });
        return userChats;
    }

    @Override
    public int findUnreadMessageCountForUser(long id) {
        return chatRoomRepository.getUserChatRoomIdsByUserId(String.valueOf(id)).stream()
                .mapToInt(chatRoom -> {
                    chatRoom.sortMessagesById(String.valueOf(id));
                    return (int) chatRoom.getSecondUserMessages().stream()
                            .filter(msg -> msg.getStatus() == MessageStatus.SENT)
                            .count();
                })
                .sum();
    }

    @Override
    public UserChatName getUserChatNameById(String senderId, String recipientId) {
        UserChatName userChat = userRepository.getUserChatNameById(senderId);
        Optional<ChatRoom> chatRoomOpt = chatRoomRepository.findByFirstUserAndSecondUserId(recipientId, senderId);
        chatRoomOpt.ifPresent(chatRoom -> {
            if (chatRoom.getLastChatMessage().isPresent()) {
                ChatMessageMongo chatMessageMongo = chatRoom.getLastChatMessage().get();
                userChat.setLastMessage(chatMessageMongo);
            }
        });
        return userChat;
    }
}