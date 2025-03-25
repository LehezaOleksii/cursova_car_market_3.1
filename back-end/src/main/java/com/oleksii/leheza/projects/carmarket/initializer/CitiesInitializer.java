package com.oleksii.leheza.projects.carmarket.initializer;

import com.oleksii.leheza.projects.carmarket.repositories.sql.CityRepository;
import com.oleksii.leheza.projects.carmarket.service.interfaces.CitiesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class CitiesInitializer {

    private final CitiesService citiesService;
    private final CityRepository cityRepository;

    public void initializeCities(String country) {
        if (cityRepository.findAll().size()<2) {
            List<String> cities = citiesService.getCitiesByCountry(country);
            citiesService.saveCities(country, cities);
        }
    }
}
