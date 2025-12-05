package com.blae.service;

import com.blae.dto.PurchaseCreateDTO;
import com.blae.dto.PurchaseDTO;
import com.blae.dto.PurchaseReportDTO;
import com.blae.model.entity.Purchase;

import java.util.List;
public interface PurchaseService {
    PurchaseDTO createPurchase(PurchaseCreateDTO purchaseCreateDTO);

    List<PurchaseDTO> getPurchaseHistoryByUserId();
    List<PurchaseReportDTO> getPurchaseReportByDate();


    List<Purchase> getAllPurchases();
    Purchase confirmPurchase(Integer purchaseId);
    Purchase getPurchaseById(Integer id);

}
