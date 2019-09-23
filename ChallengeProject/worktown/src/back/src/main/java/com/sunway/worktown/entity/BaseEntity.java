package com.sunway.worktown.entity;

import io.swagger.annotations.ApiModelProperty;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import java.io.Serializable;

/**
 * 基础实体信息
 *
 * @author malin
 * @version 1.0
 */
@MappedSuperclass
public abstract class BaseEntity implements Serializable {

    /**
     * 编码
     */
    @Id
    @Column(name = "code", nullable = false, length = 64)
    @ApiModelProperty(value = "编码")
    private String code;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
