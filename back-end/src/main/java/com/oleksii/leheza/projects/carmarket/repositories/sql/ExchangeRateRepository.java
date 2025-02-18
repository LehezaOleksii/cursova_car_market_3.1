package com.oleksii.leheza.projects.carmarket.repositories.sql;

import com.oleksii.leheza.projects.carmarket.entities.psql.ExchangeRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, Long> {

    @Query("SELECT e.rate FROM ExchangeRate e WHERE e.currencyShortNameA = :currencyShortNameA AND e.currencyShortNameB = :currencyShortNameB")
    String findExchangeRateByCurrencyShortNameAAndCurrencyShortNameB(String currencyShortNameA, String currencyShortNameB);

    @Query("SELECT e FROM ExchangeRate e WHERE e.currencyShortNameA = :currencyShortNameA AND e.currencyShortNameB = :currencyShortNameB")
    Optional<ExchangeRate> findExchangeRateObjectByCurrencyShortNameAAndCurrencyShortNameB(String currencyShortNameA, String currencyShortNameB);

    String currencyShortNameA(String currencyShortNameA);
}
