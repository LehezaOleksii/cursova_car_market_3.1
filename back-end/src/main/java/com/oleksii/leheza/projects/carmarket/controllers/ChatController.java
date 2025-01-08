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
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
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
    @GetMapping("/history")
    public ResponseEntity<ChatHistory> retrieveChatHistory(@RequestParam String firstUserId,
                                                           @RequestParam String secondUserId) {
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
    @GetMapping("/rooms")
    public ResponseEntity<List<UserChatName>> getAllExistingChatsForUser(@RequestParam String id) {
        return new ResponseEntity<>(chatRoomService.getUserChats(id), HttpStatus.OK);
    }
}