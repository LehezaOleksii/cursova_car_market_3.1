package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.dto.Response;
import com.oleksii.leheza.projects.carmarket.service.interfaces.ExchangeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/exchanges")
@RequiredArgsConstructor
@Tag(name = "Exchange rates", description = "Methods related to exchange rate")
public class ExchangeController {

    private final ExchangeService exchangeService;

    @Operation(summary = "Get usd to uah exchange rate", description = "Get usd to uah exchange rate.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rate retrieved successfully",
                    content = @Content(schema = @Schema(implementation = Response.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "204", description = "Rate is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @GetMapping
    public ResponseEntity<Response> getUsdToUah(@RequestParam String CurrencyShortNameA,
                                                @RequestParam String CurrencyShortNameB) {
        Response r = new Response(exchangeService.getExchangeRateUsdToUah(CurrencyShortNameA, CurrencyShortNameB));
        return new ResponseEntity<>(new Response(exchangeService.getExchangeRateUsdToUah(CurrencyShortNameA, CurrencyShortNameB)), HttpStatus.OK);
    }
}
