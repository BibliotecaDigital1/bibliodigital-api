package com.blae.mapper;

import com.blae.dto.PurchaseCreateDTO;
import com.blae.dto.PurchaseDTO;
import com.blae.dto.PurchaseItemCreateDTO;
import com.blae.dto.PurchaseItemDTO;
import com.blae.model.entity.Book;
import com.blae.model.entity.Purchase;
import com.blae.model.entity.PurchaseItem;
import com.blae.model.entity.User;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.stereotype.Component;

@Component
public class PurchaseMapper {

    private final ModelMapper modelMapper;

    public PurchaseMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
        this.modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
    }

    public Purchase toPurchaseCreateDTO(PurchaseCreateDTO purchaseDTO){
        Purchase purchase= modelMapper.map(purchaseDTO, Purchase.class);

        User user = new User();
        user.setId(purchaseDTO.getCustomerId());
        purchase.setUser(user);

        purchase.setItems(purchaseDTO.getItems().stream()
                .map(this::toPurchaseItemEntity)
                .toList());

        return purchase;
    }

    public PurchaseDTO toPurchaseDTO(Purchase purchase){
        PurchaseDTO purchaseDTO = modelMapper.map(purchase, PurchaseDTO.class);

        purchaseDTO.setItems(purchase.getItems().stream()
                .map(this::toPurchaseItemDTO)
                .toList());
        return purchaseDTO;
    }

    private PurchaseItem toPurchaseItemEntity(PurchaseItemCreateDTO itemDTO) {
        PurchaseItem item = modelMapper.map(itemDTO, PurchaseItem.class);
        Book book = new Book();
        book.setId(itemDTO.getBookId());
        item.setBook(book);
        return item;
    }

    private PurchaseItemDTO toPurchaseItemDTO(PurchaseItem item){
        PurchaseItemDTO itemDTO = modelMapper.map(item, PurchaseItemDTO.class);
        itemDTO.setBookId(item.getBook().getId());
        itemDTO.setBookTitle(item.getBook().getTitle());
        return itemDTO;
    }
}