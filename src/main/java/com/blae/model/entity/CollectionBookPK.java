package com.blae.model.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

@Data
@EqualsAndHashCode
public class CollectionBookPK implements Serializable {
    private Integer book;
    private Integer collection;
}
