package com.oleksii.leheza.projects.carmarket.service.implementations;

import com.oleksii.leheza.projects.carmarket.dto.chat.ChatHistory;
import com.oleksii.leheza.projects.carmarket.dto.chat.UserChatName;
import com.oleksii.leheza.projects.carmarket.dto.mapper.DtoMapper;
import com.oleksii.leheza.projects.carmarket.entities.mongo.ChatMessage;
import com.oleksii.leheza.projects.carmarket.entities.mongo.ChatRoom;
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

//    @Override
//    public Optional<String> getChatId(String senderId, String recipientId, boolean createIfNotExist) {
//
//        return chatRoomRepository
//                .findBySenderIdAndRecipientId(senderId, recipientId)
//                .map(ChatRoom::getChatId)
//                .or(() -> {
//                    if (!createIfNotExist) {
//                        return Optional.empty();
//                    }
//                    var chatId =
//                            String.format("%s_%s", senderId, recipientId);
//
//                    ChatRoom senderRecipient = ChatRoom
//                            .builder()
//                            .chatId(chatId)
//                            .firstUserId(senderId)
//                            .secondUserId(recipientId)
//                            .build();
//
//                    ChatRoom recipientSender = ChatRoom
//                            .builder()
//                            .chatId(chatId)
//                            .firstUserId(recipientId)
//                            .secondUserId(senderId)
//                            .build();
//                    chatRoomRepository.save(senderRecipient);
//                    chatRoomRepository.save(recipientSender);
//
//                    return Optional.of(chatId);
//                });
//    }

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
                            ChatMessage chatMessage = chatRoom.getLastChatMessage().get();
                            userChat.setLastMessage(chatMessage);
                        }
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
                            ChatMessage chatMessage = chatRoom.getLastChatMessage().get();
                            userChat.setLastMessage(chatMessage);
                        }
                    });
                });
        return userChats;
    }
}