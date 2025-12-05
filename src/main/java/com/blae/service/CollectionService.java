package com.blae.service;

import com.blae.dto.CollectionDTO;
import com.blae.model.entity.Collection;

import java.util.List;

public interface CollectionService {
    Collection createCollection(Collection collection);
    List<Collection> getCollectionsByUser(Integer userId);
    List<CollectionDTO> getCollectionsByUserWithCount(Integer userId);
    Collection getCollectionById(Integer collectionId);
    Collection updateCollection(Integer collectionId, Collection collection);
    void deleteCollection(Integer collectionId);
}
