package com.oleksii.leheza.projects.carmarket.initializer;

import com.oleksii.leheza.projects.carmarket.entities.Engine;
import com.oleksii.leheza.projects.carmarket.entities.VehicleBodyType;
import com.oleksii.leheza.projects.carmarket.entities.VehicleBrand;
import com.oleksii.leheza.projects.carmarket.entities.VehicleModel;
import com.oleksii.leheza.projects.carmarket.exceptions.DataSetReadingException;
import com.oleksii.leheza.projects.carmarket.repositories.EngineRepository;
import com.oleksii.leheza.projects.carmarket.repositories.VehicleBodyTypeRepository;
import com.oleksii.leheza.projects.carmarket.repositories.VehicleBrandRepository;
import com.oleksii.leheza.projects.carmarket.repositories.VehicleModelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
@Slf4j
public class CarDatasetParser {

    private static final String DATASET_PATH = "/vehicle_dataset.csv";
    private static final String DELIMITER = ";";
    private static final String YEAR_SEPARATOR = ",";
    private static final int BRAND_NAME_INDEX = 0;
    private static final int MODEL_NAME_INDEX = 1;
    private static final int PRODUCTION_YEARS_INDEX = 2;
    private static final int BODY_STYLE_INDEX = 5;
    private static final int ENGINE_SPECS_INDEX = 9;

    private final VehicleBrandRepository vehicleBrandRepository;
    private final VehicleModelRepository vehicleModelRepository;
    private final VehicleBodyTypeRepository vehicleBodyTypeRepository;
    private final EngineRepository engineRepository;

    public void parseDataset() throws DataSetReadingException {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(Objects.requireNonNull(getClass().getResourceAsStream(DATASET_PATH)), StandardCharsets.UTF_8))) {

            reader.lines().skip(1).forEach(line -> {
                String[] data = line.split(DELIMITER);
                String[] years = data[PRODUCTION_YEARS_INDEX].split(YEAR_SEPARATOR);
                int fromYear = parseYear(years[0].trim());
                int toYear = parseYear(years[years.length - 1].trim());
                String brandName = data[BRAND_NAME_INDEX].trim();
                VehicleBrand brand = saveBrand(brandName);
                String bodyStyle = parseBodyStyle(data);
                VehicleBodyType vehicleBodyType = saveBodyStyle(bodyStyle);
                String modelName = data[MODEL_NAME_INDEX].trim();
                Engine engine = saveEngine(parseEngine(data));
                VehicleModel vehicleModel = new VehicleModel(modelName, fromYear, toYear, vehicleBodyType, brand);
                vehicleModel.addEngine(engine);
                saveModel(vehicleModel);
            });
        } catch (Exception e) {
            log.error("Exception while parsing dataset; exception : {}", e.getMessage(), e);
            throw new DataSetReadingException(e);
        }
    }

    private Engine saveEngine(Engine engine) {
        return engineRepository
                .findByName(engine.getName())
                .orElseGet(() -> {
                    engineRepository.save(engine);
                    return engine;
                });
    }

    private VehicleBodyType saveBodyStyle(String bodyStyle) {
        return vehicleBodyTypeRepository
                .findByBodyTypeName(bodyStyle)
                .orElseGet(() -> {
                    VehicleBodyType newBodyType = new VehicleBodyType(bodyStyle);
                    vehicleBodyTypeRepository.save(newBodyType);
                    return newBodyType;
                });
    }

    private VehicleModel saveModel(VehicleModel vehicleModel) {
        Optional<VehicleModel> vehicleModelOptional = vehicleModelRepository
                .findByModelNameAndFirstProductionYearAndLastProductionYear(
                        vehicleModel.getModelName(),
                        vehicleModel.getFirstProductionYear(),
                        vehicleModel.getLastProductionYear());

        if (vehicleModelOptional.isEmpty()) {
            vehicleModelRepository.save(vehicleModel);
            return vehicleModel;
        }
        return vehicleModelOptional.get();
    }

    private VehicleBrand saveBrand(String brandName) {
        return vehicleBrandRepository
                .findByBrandName(brandName)
                .orElseGet(() -> {
                    VehicleBrand newBrand = new VehicleBrand(brandName);
                    return vehicleBrandRepository.save(newBrand);
                });
    }

    private Engine parseEngine(String[] data) {
        String engineSpecs = data[ENGINE_SPECS_INDEX].trim();
        String volumePattern = "(\\d+(\\.\\d+)?)L";
        String horsepowerPattern = "\\((\\d+) HP\\)";
        Pattern volumeRegex = Pattern.compile(volumePattern);
        Matcher volumeMatcher = volumeRegex.matcher(engineSpecs);
        Pattern horsepowerRegex = Pattern.compile(horsepowerPattern);
        Matcher horsepowerMatcher = horsepowerRegex.matcher(engineSpecs);
        float volume = 0;
        if (volumeMatcher.find()) {
            volume = Float.parseFloat(volumeMatcher.group(1));
        }
        float horsepower = 0;
        if (horsepowerMatcher.find()) {
            horsepower = Float.parseFloat(horsepowerMatcher.group(1));
        }
        return new Engine(engineSpecs, volume, horsepower);
    }

    private String parseBodyStyle(String[] data) {
        String bodyStyle = data[BODY_STYLE_INDEX].trim();
        if (bodyStyle.equals("") || bodyStyle.equals("nan")) {
            return "";
        }
        return bodyStyle;
    }

    private int parseYear(String yearString) {
        try {
            return Integer.parseInt(yearString);
        } catch (NumberFormatException e) {
            log.warn("Invalid year format: {}", yearString);
            return 0;
        }
    }
}
