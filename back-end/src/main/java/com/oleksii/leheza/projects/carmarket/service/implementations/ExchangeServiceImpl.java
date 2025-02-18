package com.oleksii.leheza.projects.carmarket.service.implementations;

import com.oleksii.leheza.projects.carmarket.repositories.sql.ExchangeRateRepository;
import com.oleksii.leheza.projects.carmarket.service.interfaces.ExchangeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExchangeServiceImpl implements ExchangeService {

    private final ExchangeRateRepository exchangeRateRepository;

    @Override
    public String getExchangeRateUsdToUah(String CurrencyShortNameA, String CurrencyShortNameB) {
        String s = exchangeRateRepository.findExchangeRateByCurrencyShortNameAAndCurrencyShortNameB(CurrencyShortNameA, CurrencyShortNameB);
        return exchangeRateRepository.findExchangeRateByCurrencyShortNameAAndCurrencyShortNameB(CurrencyShortNameA, CurrencyShortNameB);
    }
}
