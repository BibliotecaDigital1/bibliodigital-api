package com.blae.api;

import com.blae.model.entity.Purchase;
import com.blae.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/admin/reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminReportController {

    private final PurchaseService purchaseService;

    @GetMapping("/sales")
    public ResponseEntity<List<Map<String, Object>>> getSalesReport() {
        List<Purchase> purchases = purchaseService.getAllPurchases();
        
        List<Map<String, Object>> report = purchases.stream()
            .map(purchase -> {
                Map<String, Object> item = new HashMap<>();
                item.put("purchaseId", purchase.getId());
                item.put("purchaseDate", purchase.getCreatedAt());
                item.put("total", purchase.getTotal());
                item.put("status", purchase.getPaymentStatus() != null ? purchase.getPaymentStatus().name() : "PENDING");

                String customerName = "";
                if (purchase.getUser() != null) {
                    customerName = purchase.getUser().getEmail();
                }
                item.put("customerName", customerName);
                return item;
            })
            .toList();
        
        return ResponseEntity.ok(report);
    }
}
