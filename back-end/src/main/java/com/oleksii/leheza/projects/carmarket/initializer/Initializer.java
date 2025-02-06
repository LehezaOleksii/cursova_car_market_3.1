package com.oleksii.leheza.projects.carmarket.initializer;

import com.oleksii.leheza.projects.carmarket.repositories.sql.CityRepository;
import com.oleksii.leheza.projects.carmarket.repositories.sql.VehicleBrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Initializer implements CommandLineRunner {

    private static final String CITY_NAME = "Ukraine";

    private final CarDatasetParser carDatasetParser;
    private final CitiesInitializer citiesInitializer;
    private final VehicleBrandRepository vehicleBrandRepository;
    private final CityRepository cityRepository;

    @Override
    public void run(String... args) {
        if (vehicleBrandRepository.findAll().isEmpty()) {
            carDatasetParser.parseDataset();
        }
        if (cityRepository.findAll().isEmpty()) {
            citiesInitializer.initializeCities(CITY_NAME);
        }
    }
}
