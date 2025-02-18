package com.oleksii.leheza.projects.carmarket.dto;

import lombok.Data;

@Data
public class CurrencyRate {
    private int currencyCodeA;
    private int currencyCodeB;
    private double rateBuy;
    private double rateSell;
    private double rateCross;
}
