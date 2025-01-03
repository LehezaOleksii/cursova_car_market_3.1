package com.oleksii.leheza.projects.carmarket.initializer;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Initializer implements CommandLineRunner {

    private static final String CITY_NAME = "Ukraine";

    private final CarDatasetParser carDatasetParser;
    private final CitiesInitializer citiesInitializer;

    @Override
    public void run(String... args) {
//        carDatasetParser.parseDataset(); TODO
//        citiesInitializer.initializeCities(CITY_NAME);
    }
}
