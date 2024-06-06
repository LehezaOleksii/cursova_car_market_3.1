package com.oleksii.leheza.projects.carmarket.initializer;

import com.oleksii.leheza.projects.carmarket.entities.VehicleBrand;
import com.oleksii.leheza.projects.carmarket.entities.VehicleModel;
import com.oleksii.leheza.projects.carmarket.repositories.VehicleBrandRepository;
import com.oleksii.leheza.projects.carmarket.repositories.VehicleModelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.stream.Stream;

@Component
@RequiredArgsConstructor
public class Initializer implements CommandLineRunner {

    private final VehicleBrandRepository vehicleBrandRepository;
    private final VehicleModelRepository vehicleModelRepository;


    @Override
    public void run(String... args) throws Exception {
//        generateBrands();
//        generateModels();
    }

//    private void generateBrands(){
//        Stream.of("Honda","Volkswagen","Toyota").forEach(brand->
//                vehicleBrandRepository.save(VehicleBrand.builder()
//                        .brandName(brand)
//                        .build()));
//    }
//    private void generateModels(){
//     honda crv civic
//    }
}
