package com.oleksii.leheza.projects.carmarket.service.interfaces;

import java.util.List;

public interface CitiesService {
    List<String> getCitiesByCountry(String country);

    void saveCities(String country, List<String> citiesNames);
}
