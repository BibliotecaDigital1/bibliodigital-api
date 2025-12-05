package com.blae.api;

import com.blae.dto.PurchaseCreateDTO;
import com.blae.dto.PurchaseDTO;
import com.blae.dto.PurchaseReportDTO;
import com.blae.model.entity.Purchase;
import com.blae.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/purchases")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class PurchaseController {

    private final PurchaseService purchaseService;

    @GetMapping
    public ResponseEntity<List<Purchase>> listAllPurchases() {
        List<Purchase> purchases = purchaseService.getAllPurchases();
        return ResponseEntity.ok(purchases);
    }

    @PostMapping
    public ResponseEntity<PurchaseDTO> createPurchase(@RequestBody PurchaseCreateDTO purchaseCreateDTO) {
        PurchaseDTO savedPurchase = purchaseService.createPurchase(purchaseCreateDTO);
        return new ResponseEntity<>(savedPurchase, HttpStatus.CREATED);
    }

    @GetMapping("/user")
    public ResponseEntity<List<PurchaseDTO>> getPurchaseHistory() {
        List<PurchaseDTO> purchaseHistory = purchaseService.getPurchaseHistoryByUserId();
        return ResponseEntity.ok(purchaseHistory);
    }

    @GetMapping("/report")
    public ResponseEntity<List<PurchaseReportDTO>> getPurchaseReport(){
        List<PurchaseReportDTO> reports = purchaseService.getPurchaseReportByDate();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Purchase> getPurchaseById(@PathVariable Integer id) {
        Purchase purchase = purchaseService.getPurchaseById(id);
        return ResponseEntity.ok(purchase);
    }

    @PutMapping("/confirm/{id}")
    public ResponseEntity<Purchase> confirmPurchase(@PathVariable Integer id) {
        Purchase confirmedPurchase = purchaseService.confirmPurchase(id);
        return ResponseEntity.ok(confirmedPurchase);
    }
}