package com.oleksii.leheza.projects.carmarket.security.filter.specifications;

import com.oleksii.leheza.projects.carmarket.entities.psql.Vehicle;
import com.oleksii.leheza.projects.carmarket.enums.GearBox;
import com.oleksii.leheza.projects.carmarket.enums.UsageStatus;
import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;
import com.oleksii.leheza.projects.carmarket.repositories.VehicleRepository;
import com.oleksii.leheza.projects.carmarket.security.filter.filters.VehicleSearchCriteria;
import jakarta.persistence.criteria.Join;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.time.Year;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class VehicleSpecification {

    private final VehicleRepository vehicleRepository;

    public Page<Vehicle> getVehiclesWithCriterias(VehicleSearchCriteria criterias, VehicleStatus vehicleStatus, int page, int size, Sort sort) {
        log.info("Start creating vehicle specifications");
        List<Specification<Vehicle>> specifications = new ArrayList<>();

        if (criterias.getUsageStatus() != null && !criterias.getUsageStatus().isEmpty() && !criterias.getUsageStatus().equals("ALL")) {
            specifications.add(usageStatusLike(criterias));
        }

        if (criterias.getBrandName() != null && !criterias.getBrandName().isEmpty()) {
            specifications.add(brandNameLike(criterias));
        }

        if (criterias.getModelName() != null && !criterias.getModelName().isEmpty()) {
            specifications.add(modelNameLike(criterias));
        }

        if (criterias.getGearBox() != null && !criterias.getGearBox().isEmpty()) {
            specifications.add(gearboxLike(criterias));
        }

        if (criterias.getRegion() != null && !criterias.getRegion().isEmpty()) {
            specifications.add(regionLike(criterias));
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

        if (vehicleStatus != null) {
            specifications.add(vehicleStatusLike(vehicleStatus));
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
        return (root, query, criteriaBuilder) -> {
            if (criterias.getToYear() != null && !criterias.getToYear().isEmpty()) {
                Year toYear = Year.parse(criterias.getToYear());
                return criteriaBuilder.lessThanOrEqualTo(root.get("year"), toYear);
            }
            return criteriaBuilder.conjunction();
        };
    }

    public Specification<Vehicle> fromYear(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) -> {
            if (criterias.getFromYear() != null && !criterias.getFromYear().isEmpty()) {
                Year fromYear = Year.parse(criterias.getFromYear());
                return criteriaBuilder.greaterThanOrEqualTo(root.get("year"), fromYear);
            }
            return criteriaBuilder.conjunction();
        };
    }

    public Specification<Vehicle> engineLike(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) -> {
            if (criterias.getEngine() != null) {
                return criteriaBuilder.like(root.get("engine").get("name"), "%" + criterias.getEngine() + "%");
            }
            return criteriaBuilder.conjunction();
        };
    }

    public Specification<Vehicle> bodyTypeLike(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) -> {
            Join<Object, Object> brandJoin = root.join("bodyType");
            return criteriaBuilder.like(brandJoin.get("bodyTypeName"), criterias.getBodyType());
        };
    }

    public Specification<Vehicle> regionLike(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("region"), "%" + criterias.getRegion() + "%");
    }

    public Specification<Vehicle> gearboxLike(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("gearBox"), GearBox.valueOf(criterias.getGearBox()));
    }

    public Specification<Vehicle> modelNameLike(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) -> {
            Join<Object, Object> modelJoin = root.join("vehicleModel");
            return criteriaBuilder.like(modelJoin.get("modelName"), criterias.getModelName());
        };
    }

    public Specification<Vehicle> brandNameLike(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) -> {
            Join<Object, Object> brandJoin = root.join("brand");
            return criteriaBuilder.like(brandJoin.get("brandName"), criterias.getBrandName());
        };
    }

    public Specification<Vehicle> usageStatusLike(VehicleSearchCriteria criterias) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("usageStatus"), UsageStatus.valueOf(criterias.getUsageStatus()));

    }

    public Specification<Vehicle> vehicleStatusLike(VehicleStatus vehicleStatus) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("status"), vehicleStatus);
    }
}
