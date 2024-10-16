package com.oleksii.leheza.projects.carmarket.security.filter.specifications;

import com.oleksii.leheza.projects.carmarket.entities.Vehicle;
import com.oleksii.leheza.projects.carmarket.enums.GearBox;
import com.oleksii.leheza.projects.carmarket.enums.UsageStatus;
import com.oleksii.leheza.projects.carmarket.repositories.VehicleRepository;
import com.oleksii.leheza.projects.carmarket.security.filter.filters.VehicleSearchCriteria;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class VehicleSpecification {

    private final VehicleRepository vehicleRepository;

    public Page<Vehicle> getVehiclesWithCriterias(VehicleSearchCriteria criterias, int page, int size, Sort sort) {
        log.info("Start creating vehicle specifications");
        List<Specification<Vehicle>> specifications = new ArrayList<>();

        if (criterias.getUsageStatus() != null && !criterias.getUsageStatus().isEmpty()) {
            specifications.add(usageStatusLike(criterias));
        }

        if (criterias.getBrandName() != null && !criterias.getBrandName().isEmpty()) {
            specifications.add(brandNameLike(criterias));
        }

        if (criterias.getModelName() != null && !criterias.getModelName().isEmpty()) {
            specifications.add(modelNameLike(criterias));
        }

        if (criterias.getGearbox() != null && !criterias.getGearbox().isEmpty()) {
            specifications.add(gearboxLike(criterias));
        }

        if (criterias.getRegion() != null && !criterias.getRegion().isEmpty()) {
            specifications.add(regionLike(criterias));
        }

        if (criterias.getPhoneNumber() != null && !criterias.getPhoneNumber().isEmpty()) {
            specifications.add(phoneNumberLike(criterias));
        }

        if (criterias.getBodyType() != null && !criterias.getBodyType().isEmpty()) {
            specifications.add(bodyTypeLike(criterias));
        }

        if (criterias.getEngine() != null && !criterias.getEngine().isEmpty()) {
            specifications.add(engineLike(criterias));
        }

        if (criterias.getFromYear() != null && !criterias.getFromYear().isEmpty()) {
            specifications.add(fromYear(criterias));
        }

        if (criterias.getToYear() != null && !criterias.getToYear().isEmpty()) {
            specifications.add(toYear(criterias));
        }

        if (criterias.getFromPrice() != null && !criterias.getFromPrice().isEmpty()) {
            specifications.add(fromPrice(criterias));
        }

        if (criterias.getToPrice() != null && !criterias.getToPrice().isEmpty()) {
            specifications.add(toPrice(criterias));
        }

        if (criterias.getFromMileage() != null && !criterias.getFromMileage().isEmpty()) {
            specifications.add(fromMileage(criterias));
        }

        if (criterias.getToMileage() != null && !criterias.getToMileage().isEmpty()) {
            specifications.add(toMileage(criterias));
        }
        Specification<Vehicle> specification = Specification.where(Specification.allOf(specifications));
        Pageable pageable = PageRequest.of(page, size, sort);
        log.info("vehicle specifications was created");
        return vehicleRepository.findAll(specification, pageable);
    }

    public Specification<Vehicle> toMileage(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(root.get("mileage"), criterias.getToMileage());
    }

    public Specification<Vehicle> fromMileage(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("mileage"), criterias.getFromMileage());
    }

    public Specification<Vehicle> toPrice(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(root.get("price"), criterias.getToPrice());
    }

    public Specification<Vehicle> fromPrice(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("price"), criterias.getFromPrice());
    }

    public Specification<Vehicle> toYear(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(root.get("year"), criterias.getToYear());
    }

    public Specification<Vehicle> fromYear(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("year"), criterias.getFromYear());
    }

    public Specification<Vehicle> engineLike(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("engine").get("name"), "%" + criterias.getEngine() + "%");
    }

    public Specification<Vehicle> bodyTypeLike(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("bodyType").get("bodyTypeName"), "%" + criterias.getBodyType() + "%");
    }

    public Specification<Vehicle> phoneNumberLike(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("phoneNumber"), "%" + criterias.getPhoneNumber() + "%");
    }

    public Specification<Vehicle> regionLike(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("region").get("name"), "%" + criterias.getRegion() + "%");
    }

    public Specification<Vehicle> gearboxLike(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("gearBox"), GearBox.valueOf(criterias.getGearbox()));
    }

    public Specification<Vehicle> modelNameLike(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("model").get("name"), "%" + criterias.getModelName() + "%");
    }

    public Specification<Vehicle> brandNameLike(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("brandName").get("name"), "%" + criterias.getBrandName() + "%");
    }

    public Specification<Vehicle> usageStatusLike(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("usageStatus"), UsageStatus.valueOf(criterias.getUsageStatus()));
    }
}
