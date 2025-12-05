package com.blae.service.impl;

import com.blae.dto.CollectionDTO;
import com.blae.model.entity.Collection;
import com.blae.repository.CollectionBookRepository;
import com.blae.repository.CollectionRepository;
import com.blae.service.CollectionService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CollectionServiceImpl implements CollectionService {

    private final CollectionRepository collectionRepository;
    private final CollectionBookRepository collectionBookRepository;

    @Override
    public Collection createCollection(Collection collection) {
        collection.setCreatedAt(LocalDateTime.now());
        return collectionRepository.save(collection);
    }

    @Override
    public List<Collection> getCollectionsByUser(Integer userId) {
        return collectionRepository.findByCustomer_Id(userId);
    }

    @Override
    public List<CollectionDTO> getCollectionsByUserWithCount(Integer userId) {
        List<Collection> collections = collectionRepository.findByCustomer_Id(userId);
        return collections.stream().map(c -> {
            CollectionDTO dto = new CollectionDTO();
            dto.setId(c.getId());
            dto.setName(c.getName());
            dto.setCreatedAt(c.getCreatedAt());
            dto.setUpdatedAt(c.getUpdatedAt());

            List<Integer> bookIds = collectionBookRepository.findBookIdsByCollectionId(c.getId());
            dto.setBookCount(bookIds != null ? bookIds.size() : 0);
            return dto;
        }).toList();
    }

    @Override
    public Collection getCollectionById(Integer collectionId) {
        return collectionRepository.findById(collectionId)
                .orElseThrow(() -> new RuntimeException("Collection not found"));
    }

    @Override
    @Transactional
    public Collection updateCollection(Integer collectionId, Collection updatedCollection) {
        Collection existingCollection = getCollectionById(collectionId);
        existingCollection.setName(updatedCollection.getName());
        existingCollection.setUpdatedAt(LocalDateTime.now());
        return collectionRepository.save(existingCollection);
    }

    @Override
    @Transactional
    public void deleteCollection(Integer collectionId) {
        Collection collection = getCollectionById(collectionId);
        collectionRepository.delete(collection);
    }
}