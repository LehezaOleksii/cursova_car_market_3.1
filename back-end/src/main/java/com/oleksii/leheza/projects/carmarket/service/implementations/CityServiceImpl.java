package com.oleksii.leheza.projects.carmarket.service.implementations;

import com.oleksii.leheza.projects.carmarket.entities.City;
import com.oleksii.leheza.projects.carmarket.repositories.CityRepository;
import com.oleksii.leheza.projects.carmarket.service.interfaces.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CityServiceImpl implements CityService {

    private final CityRepository cityRepository;

    @Override
    public List<String> getAllNames() {
        return cityRepository.findAll().stream()
                .map(City::getName)
                .toList();
    }
}
