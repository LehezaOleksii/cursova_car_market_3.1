package com.oleksii.leheza.projects.carmarket.currency;

import com.oleksii.leheza.projects.carmarket.dto.CurrencyRate;
import com.oleksii.leheza.projects.carmarket.entities.psql.ExchangeRate;
import com.oleksii.leheza.projects.carmarket.repositories.sql.ExchangeRateRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExchangeRateUpdater {

    public static final String USD = "USD";
    public static final String UAH = "UAH";
    private final ExchangeRateRepository exchangeRateRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private static final String MONOBANK_API_URL = "https://api.monobank.ua/bank/currency";

    @PostConstruct
    public void updateExchangeRateOnStartup() {
        updateExchangeRate();
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void updateExchangeRate() {
        try {
            List<CurrencyRate> data = List.of(restTemplate.getForObject(MONOBANK_API_URL, CurrencyRate[].class));
            if (data != null) {
                data.forEach(rateData -> {
                    if (rateData.getCurrencyCodeA() == 840 && rateData.getCurrencyCodeB() == 980) {
                        double rateBuy = rateData.getRateBuy();
                        saveExchangeRate(rateData.getCurrencyCodeA(), rateData.getCurrencyCodeB(), rateBuy);
                        log.info("Update ExchangeRate to " + rateData.getCurrencyCodeA() + " and "
                                + rateData.getCurrencyCodeB() + "; Date:" + LocalDateTime.now());
                    }
                });
            }
        } catch (Exception e) {
            log.error("Error fetching exchange rate data", e);
        }
    }

    private void saveExchangeRate(int currencyCodeA, int currencyCodeB, double rateBuy) {
        ExchangeRate exchangeRate = ExchangeRate.builder()
                .currencyCodeA(String.valueOf(currencyCodeA))
                .currencyCodeB(String.valueOf(currencyCodeB))
                .currencyShortNameA(USD)
                .currencyShortNameB(UAH)
                .rate(String.valueOf(rateBuy))
                .lastUpdatedDate(LocalDateTime.now())
                .build();
        Optional<ExchangeRate> optionalExchangeRate = exchangeRateRepository
                .findExchangeRateObjectByCurrencyShortNameAAndCurrencyShortNameB(USD, UAH);
        optionalExchangeRate.ifPresent(rate -> exchangeRate.setId(rate.getId()));
        exchangeRateRepository.save(exchangeRate);
    }
}
