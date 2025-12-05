package com.blae.service.impl;

import com.blae.dto.PurchaseCreateDTO;
import com.blae.dto.PurchaseDTO;
import com.blae.dto.PurchaseReportDTO;
import com.blae.exception.ResourceNotFoundException;
import com.blae.mapper.PurchaseMapper;
import com.blae.model.entity.Book;
import com.blae.model.entity.Purchase;
import com.blae.model.entity.PurchaseItem;
import com.blae.model.entity.User;
import com.blae.model.enums.PaymentStatus;
import com.blae.repository.BookRepository;
import com.blae.repository.PurchaseRepository;
import com.blae.repository.UserRepository;
import com.blae.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PurchaseServiceImpl implements PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final PurchaseMapper purchaseMapper;


    @Override
    @Transactional
    public PurchaseDTO createPurchase(PurchaseCreateDTO purchaseCreateDTO) {

        Purchase purchase = purchaseMapper.toPurchaseCreateDTO(purchaseCreateDTO);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = null;

        if (authentication != null && !authentication.getPrincipal().equals("anonymousUser")) {
            user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(ResourceNotFoundException::new);
        }

        purchase.getItems().forEach(item->{
            Book book = bookRepository.findById(item.getBook().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Book not found"));
            item.setBook(book);
            item.setPurchase(purchase);
        });

        Float total = purchase.getItems()
                .stream()
                .map(item -> item.getPrice() * item.getQuantity())
                .reduce(0f, Float::sum);

        purchase.setCreatedAt(LocalDateTime.now());
        purchase.setPaymentStatus(PaymentStatus.PENDING);

        purchase.setUser(user);
        purchase.setTotal(total);
        purchase.getItems().forEach(item -> item.setPurchase(purchase));

        Purchase savePurchase = purchaseRepository.save(purchase);

        return purchaseMapper.toPurchaseDTO(savePurchase);
    }

    @Override
    @Transactional(readOnly = true)

    public List<PurchaseDTO> getPurchaseHistoryByUserId() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = null;

        if (authentication != null && !authentication.getPrincipal().equals("anonymousUser")) {
            user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(ResourceNotFoundException::new);
        }

        return purchaseRepository.findByUserId(user.getId()).stream()
                .map(purchaseMapper::toPurchaseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    @Override
    public List<PurchaseReportDTO> getPurchaseReportByDate() {
        List<Object[]> results = purchaseRepository.getPurchaseReportByDate();

        List<PurchaseReportDTO> purchaseReportDTOS = results.stream()
                .map(result ->
                        new PurchaseReportDTO (
                                ((Integer)result[0]).intValue(),
                                (String)result[1]
                        )
                ).toList();
        return purchaseReportDTOS;
    }

    @Override
    public List<Purchase> getAllPurchases() {
        return purchaseRepository.findAll();
    }

    @Override
    public Purchase getPurchaseById(Integer id) {
        return purchaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase not found"));
    }

    @Override
    @Transactional
    public Purchase confirmPurchase(Integer purchaseId) {
        Purchase purchase = getPurchaseById(purchaseId);

        Float total = purchase.getItems()
                .stream()
                .map(item -> item.getPrice() * item.getQuantity())
                .reduce(0f, Float::sum);

        purchase.setTotal(total);

        purchase.setPaymentStatus(PaymentStatus.PAID);

        return purchaseRepository.save(purchase);
    }
}