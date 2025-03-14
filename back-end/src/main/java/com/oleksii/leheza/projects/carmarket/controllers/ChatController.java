package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.dto.Response;
import com.oleksii.leheza.projects.carmarket.dto.chat.ChatHistory;
import com.oleksii.leheza.projects.carmarket.dto.chat.UserChatName;
import com.oleksii.leheza.projects.carmarket.service.interfaces.ChatRoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
@Validated
@RequiredArgsConstructor
@Tag(name = "Chats", description = "Methods related to chats")
public class ChatController {

    private final ChatRoomService chatRoomService;

    @Operation(summary = "Retrieve chat by two users ids", description = "Retrieve Chat by two users ids.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Retrieve messages history of two users",
                    content = @Content(schema = @Schema(implementation = ChatHistory.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "History is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @GetMapping("/history/firstUserId/{firstUserId}/secondUserId/{secondUserId}")
    public ResponseEntity<ChatHistory> retrieveChatHistory(@PathVariable String firstUserId,
                                                           @PathVariable String secondUserId) {
        return new ResponseEntity<>(chatRoomService.retrieveChatHistory(firstUserId, secondUserId), HttpStatus.OK);
    }

    @Operation(summary = "Retrieve chat by two users ids", description = "Retrieve Chat by two users ids.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Retrieve messages history of two users",
                    content = @Content(schema = @Schema(implementation = ChatHistory.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "History is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @GetMapping("/rooms/userId/{id}")
    public ResponseEntity<List<UserChatName>> getAllExistingChatsForUser(@PathVariable String id) {
        return new ResponseEntity<>(chatRoomService.getUserChats(id), HttpStatus.OK);
    }

    @Operation(summary = "Retrieve chat by two users ids", description = "Retrieve Chat by two users ids.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Retrieve messages history of two users",
                    content = @Content(schema = @Schema(implementation = UserChatName.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "History is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @GetMapping("/users/{id}")
    public ResponseEntity<List<UserChatName>> getChatsByUserName(@PathVariable String id,//TODO
                                                                 @RequestParam String name) {
        List<UserChatName> chats = chatRoomService.getUserChatsByName(id, name);
        return !chats.isEmpty() ? new ResponseEntity<>(chats, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Operation(summary = "Retrieve chat by user id", description = "Retrieve chat by user id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Retrieve messages history of two users",
                    content = @Content(schema = @Schema(implementation = UserChatName.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "History is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @GetMapping("/users/{id}/my-id/{myId}")
    public ResponseEntity<UserChatName> getChatById(@PathVariable String id,
                                                    @PathVariable String myId) {
        UserChatName chat = chatRoomService.getUserChatNameById(id, myId);
        return new ResponseEntity<>(chat, HttpStatus.OK);
    }

    @Operation(summary = "Retrieve unread message count for user", description = "Retrieve unread message count for user by its id.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Retrieve unread message count",
                    content = @Content(schema = @Schema(implementation = Response.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "History is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @GetMapping("/users/{id}/messages/unread")
    public ResponseEntity<Response> getUnreadMessagesForUser(@PathVariable long id) {
        return new ResponseEntity<>(new Response(String.valueOf(chatRoomService.findUnreadMessageCountForUser(id))), HttpStatus.OK);
    }
}