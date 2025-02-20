package com.oleksii.leheza.projects.carmarket.service.implementations;
import com.oleksii.leheza.projects.carmarket.entities.psql.City;
import com.oleksii.leheza.projects.carmarket.repositories.sql.CityRepository;
import com.oleksii.leheza.projects.carmarket.service.interfaces.CitiesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CitiesServiceImpl implements CitiesService {

    private static final String GET_CITIES_URL = "https://countriesnow.space/api/v0.1/countries/cities/q?country=";

    private final CityRepository cityRepository;
    private final RestTemplate restTemplate;

    public List<String> getCitiesByCountry(String country) {
        ResponseEntity<String> response;
        try {
            String url = GET_CITIES_URL + country;
            response = restTemplate.getForEntity(url, String.class);

            if (response != null && !response.getStatusCode().isError() && response.getBody() != null && !response.getBody().isEmpty()) {
                log.info("Cities successfully retrieved: {}", response.getBody());
                JSONObject jsonResponse = new JSONObject(response.getBody());
                if (!jsonResponse.getBoolean("error")) {
                    JSONArray citiesArray = jsonResponse.getJSONArray("data");
                    return citiesArray.toList().stream()
                            .map(Object::toString)
                            .collect(Collectors.toList());
                } else {
                    log.error("Error in API response: {}", jsonResponse.getString("msg"));
                }
            } else {
                log.error("Error in API response: {}", response != null ? response : "No response");
            }
        } catch (Exception e) {
            log.error("Error occurred while fetching cities", e);
        }
        return List.of();
    }

    @Override
    public void saveCities(String country, List<String> citiesNames) {
        citiesNames.forEach(name -> cityRepository.save(new City(name, country)));
        log.info("Cities saved successfully; country: {}, cities {}", country, citiesNames);
    }
}
